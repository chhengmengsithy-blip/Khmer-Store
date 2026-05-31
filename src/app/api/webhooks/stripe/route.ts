import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

/**
 * Stripe Webhook Handler
 *
 * Processes Stripe webhook events with HMAC-SHA256 signature verification.
 * Events handled: payment_intent.succeeded, payment_intent.failed,
 * charge.refunded, charge.dispute.created
 *
 * Order lifecycle:
 * 1. Client calls createPaymentIntent which creates an order with status "pending"
 *    and includes order_id in PaymentIntent metadata.
 * 2. On payment_intent.succeeded, this webhook updates the order to "confirmed"
 *    using the order_id from metadata directly (no LIKE queries).
 * 3. On failure/refund/dispute, the webhook updates the order status accordingly.
 */

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Use a service-role client for webhook handling (no user session available)
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Verify the Stripe webhook signature using HMAC-SHA256.
 * Implements the same algorithm as Stripe SDK's constructEvent():
 * 1. Extract timestamp and signature from the stripe-signature header
 * 2. Build the signed payload: `${timestamp}.${payload}`
 * 3. Compute HMAC-SHA256 using the webhook secret
 * 4. Compare computed signature to the one in the header using timing-safe comparison
 */
function verifyStripeSignature(payload: string, signature: string): boolean {
  if (!STRIPE_WEBHOOK_SECRET || !signature) {
    return false;
  }

  const parts = signature.split(",");
  const timestampPart = parts.find((p) => p.startsWith("t="));
  const sigPart = parts.find((p) => p.startsWith("v1="));

  if (!timestampPart || !sigPart) {
    return false;
  }

  const timestamp = timestampPart.replace("t=", "");
  const expectedSig = sigPart.replace("v1=", "");

  // Verify timestamp is within tolerance (5 minutes) to prevent replay attacks
  const ts = parseInt(timestamp, 10);
  const age = Math.abs(Date.now() / 1000 - ts);
  if (age > 300) {
    return false;
  }

  // Compute the expected signature
  const signedPayload = `${timestamp}.${payload}`;
  const computedSig = createHmac("sha256", STRIPE_WEBHOOK_SECRET)
    .update(signedPayload, "utf8")
    .digest("hex");

  // Use timing-safe comparison to prevent timing attacks
  try {
    const expectedBuffer = Buffer.from(expectedSig, "hex");
    const computedBuffer = Buffer.from(computedSig, "hex");
    if (expectedBuffer.length !== computedBuffer.length) {
      return false;
    }
    return timingSafeEqual(expectedBuffer, computedBuffer);
  } catch {
    return false;
  }
}

async function handlePaymentIntentSucceeded(data: Record<string, unknown>) {
  const supabase = getServiceClient();

  const metadata = (data.metadata as Record<string, string>) || {};
  const orderId = metadata.order_id;
  const buyerId = metadata.buyer_id;
  const sellerId = metadata.seller_id;
  const paymentIntentId = (data.id as string) || "";
  const amount = typeof data.amount === "number" ? data.amount / 100 : 0;

  if (!orderId) {
    throw new Error("Missing order_id in PaymentIntent metadata");
  }

  // Update existing order status to confirmed
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "confirmed",
      escrow_status: "held",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (updateError) {
    throw new Error(`Failed to update order ${orderId}: ${updateError.message}`);
  }

  // Create a transaction record
  if (buyerId && sellerId) {
    const { error: txError } = await supabase.from("transactions").insert({
      payment_intent_id: paymentIntentId,
      buyer_id: buyerId,
      seller_id: sellerId,
      amount,
      status: "succeeded",
      type: "payment",
    });

    if (txError) {
      throw new Error(`Failed to create transaction: ${txError.message}`);
    }
  }
}

async function handlePaymentIntentFailed(data: Record<string, unknown>) {
  const supabase = getServiceClient();

  const metadata = (data.metadata as Record<string, string>) || {};
  const orderId = metadata.order_id;

  if (!orderId) {
    // No order to update if order_id not present
    return;
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (updateError) {
    throw new Error(`Failed to update order ${orderId}: ${updateError.message}`);
  }
}

async function handleChargeRefunded(data: Record<string, unknown>) {
  const supabase = getServiceClient();

  // For charge events, payment_intent is a field on the charge object
  const paymentIntentId =
    (data.payment_intent as string) || "";

  if (!paymentIntentId) {
    return;
  }

  // Look up the order by checking metadata via the payment_intent_id stored in notes
  const { data: existingOrder, error: lookupError } = await supabase
    .from("orders")
    .select("id, notes")
    .filter("notes", "cs", JSON.stringify({ payment_intent_id: paymentIntentId }))
    .single();

  if (lookupError || !existingOrder) {
    // If we cannot find the order, we cannot update it. Throw to trigger retry.
    throw new Error(
      `Failed to find order for refund (payment_intent: ${paymentIntentId}): ${lookupError?.message || "not found"}`
    );
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: "refunded",
      escrow_status: "released",
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingOrder.id);

  if (updateError) {
    throw new Error(`Failed to update order for refund: ${updateError.message}`);
  }
}

async function handleDisputeCreated(data: Record<string, unknown>) {
  const supabase = getServiceClient();

  const paymentIntentId = (data.payment_intent as string) || "";

  if (!paymentIntentId) {
    return;
  }

  // Look up the order by checking metadata via the payment_intent_id stored in notes
  const { data: existingOrder, error: lookupError } = await supabase
    .from("orders")
    .select("id, notes")
    .filter("notes", "cs", JSON.stringify({ payment_intent_id: paymentIntentId }))
    .single();

  if (lookupError || !existingOrder) {
    throw new Error(
      `Failed to find order for dispute (payment_intent: ${paymentIntentId}): ${lookupError?.message || "not found"}`
    );
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      escrow_status: "frozen",
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingOrder.id);

  if (updateError) {
    throw new Error(`Failed to update order for dispute: ${updateError.message}`);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature") || "";

    // Verify webhook signature using HMAC-SHA256
    const isValid = verifyStripeSignature(payload, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(payload);
    const eventType: string = event.type;
    const eventData = event.data?.object || {};

    // Route event to appropriate handler
    // Handlers throw on DB errors so the outer catch returns 500, triggering Stripe retry.
    switch (eventType) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(eventData);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(eventData);
        break;
      case "charge.refunded":
        await handleChargeRefunded(eventData);
        break;
      case "charge.dispute.created":
        await handleDisputeCreated(eventData);
        break;
      default:
        // Acknowledge but don't process unknown event types
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    // Return 500 so Stripe retries the webhook delivery
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
