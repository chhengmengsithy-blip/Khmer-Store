import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Stripe Webhook Handler
 *
 * Processes Stripe webhook events with HMAC-SHA256 signature verification.
 * Events handled: payment_intent.succeeded, payment_intent.failed,
 * charge.refunded, charge.dispute.created
 */

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

/**
 * Verify the Stripe webhook signature using HMAC-SHA256.
 * Implements the same algorithm as Stripe SDK's constructEvent():
 * 1. Extract timestamp and signature from the stripe-signature header
 * 2. Build the signed payload: `${timestamp}.${payload}`
 * 3. Compute HMAC-SHA256 using the webhook secret
 * 4. Compare computed signature to the one in the header using timing-safe comparison
 */
function verifyStripeSignature(
  payload: string,
  signature: string
): boolean {
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
  // Process successful payment:
  // 1. Update order status
  // 2. Move funds to escrow
  // 3. Notify buyer and seller
  void data;
}

async function handlePaymentIntentFailed(data: Record<string, unknown>) {
  // Handle failed payment:
  // 1. Update order status
  // 2. Notify buyer
  // 3. Log for fraud monitoring if repeated
  void data;
}

async function handleChargeRefunded(data: Record<string, unknown>) {
  // Process refund:
  // 1. Update escrow status
  // 2. Update order status
  // 3. Notify both parties
  void data;
}

async function handleDisputeCreated(data: Record<string, unknown>) {
  // Handle dispute:
  // 1. Flag order for admin review
  // 2. Freeze escrow funds
  // 3. Notify admin team
  void data;
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
