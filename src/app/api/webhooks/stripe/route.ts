import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createClient } from "@supabase/supabase-js";

/**
 * Stripe Webhook Handler
 *
 * Processes Stripe webhook events with HMAC-SHA256 signature verification.
 * Events handled: payment_intent.succeeded, payment_intent.failed,
 * charge.refunded, charge.dispute.created
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
  const buyerId = metadata.buyer_id;
  const sellerId = metadata.seller_id;
  const shippingAddress = metadata.shipping_address || "";
  const itemsJson = metadata.items || "[]";
  const amount = typeof data.amount === "number" ? data.amount / 100 : 0;
  const paymentIntentId = (data.id as string) || "";

  if (!buyerId || !sellerId) {
    return;
  }

  // Check if an order already exists for this payment intent
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .like("notes", `%${paymentIntentId}%`)
    .single();

  if (existingOrder) {
    // Update existing order status to confirmed
    await supabase
      .from("orders")
      .update({
        status: "confirmed",
        escrow_status: "held",
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingOrder.id);
  } else {
    // Create a new order
    const commission = amount * 0.03;
    const notesJson = JSON.stringify({
      items: JSON.parse(itemsJson),
      payment_intent_id: paymentIntentId,
    });

    await supabase.from("orders").insert({
      buyer_id: buyerId,
      seller_id: sellerId,
      status: "confirmed",
      total: amount,
      commission,
      escrow_status: "held",
      shipping_address: shippingAddress,
      notes: notesJson,
    });
  }

  // Create a transaction record if the table exists
  await supabase.from("transactions").insert({
    payment_intent_id: paymentIntentId,
    buyer_id: buyerId,
    seller_id: sellerId,
    amount,
    status: "succeeded",
    type: "payment",
  });
}

async function handlePaymentIntentFailed(data: Record<string, unknown>) {
  const supabase = getServiceClient();

  const paymentIntentId = (data.id as string) || "";

  if (!paymentIntentId) {
    return;
  }

  // Find and update the order if one exists
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .like("notes", `%${paymentIntentId}%`)
    .single();

  if (existingOrder) {
    await supabase
      .from("orders")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingOrder.id);
  }
}

async function handleChargeRefunded(data: Record<string, unknown>) {
  const supabase = getServiceClient();

  const paymentIntentId =
    (data.payment_intent as string) || (data.id as string) || "";

  if (!paymentIntentId) {
    return;
  }

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .like("notes", `%${paymentIntentId}%`)
    .single();

  if (existingOrder) {
    await supabase
      .from("orders")
      .update({
        status: "refunded",
        escrow_status: "released",
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingOrder.id);
  }
}

async function handleDisputeCreated(data: Record<string, unknown>) {
  const supabase = getServiceClient();

  const paymentIntentId = (data.payment_intent as string) || "";

  if (!paymentIntentId) {
    return;
  }

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .like("notes", `%${paymentIntentId}%`)
    .single();

  if (existingOrder) {
    await supabase
      .from("orders")
      .update({
        escrow_status: "frozen",
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingOrder.id);
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
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
