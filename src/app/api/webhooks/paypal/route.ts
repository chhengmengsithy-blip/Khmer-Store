import { NextResponse } from "next/server";
import { createVerify } from "crypto";

/**
 * PayPal Webhook Handler
 *
 * Processes PayPal webhook notifications with certificate-based signature verification.
 * Events handled: PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED,
 * CUSTOMER.DISPUTE.CREATED, CUSTOMER.DISPUTE.RESOLVED
 *
 * PayPal signs webhooks using SHA256withRSA. Verification steps:
 * 1. Fetch PayPal's signing certificate from the cert_url header
 * 2. Construct the expected message: transmission_id|transmission_time|webhook_id|crc32(body)
 * 3. Verify the signature against the certificate using SHA256withRSA
 */

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || "";

/**
 * Compute CRC32 checksum of a string.
 * Used as part of PayPal's signature verification protocol.
 */
function crc32(str: string): number {
  let crc = 0xffffffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Fetch and validate PayPal's signing certificate.
 * Only certificates from paypal.com domains are accepted to prevent MITM attacks.
 */
async function fetchPayPalCertificate(certUrl: string): Promise<string | null> {
  // Validate that cert URL is from PayPal (prevents attacker-controlled certificates)
  try {
    const url = new URL(certUrl);
    if (!url.hostname.endsWith(".paypal.com") && !url.hostname.endsWith(".symantec.com")) {
      return null;
    }
    if (url.protocol !== "https:") {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const response = await fetch(certUrl);
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

/**
 * Verify PayPal webhook signature using SHA256withRSA.
 * Constructs the expected message and verifies against the provided signature.
 */
async function verifyPayPalSignature(
  request: Request,
  body: string
): Promise<boolean> {
  const transmissionId = request.headers.get("paypal-transmission-id");
  const transmissionTime = request.headers.get("paypal-transmission-time");
  const certUrl = request.headers.get("paypal-cert-url");
  const transmissionSig = request.headers.get("paypal-transmission-sig");
  const authAlgo = request.headers.get("paypal-auth-algo") || "SHA256withRSA";

  if (!transmissionId || !transmissionTime || !certUrl || !transmissionSig) {
    return false;
  }

  if (!PAYPAL_WEBHOOK_ID) {
    // Webhook ID must be configured to verify signatures
    return false;
  }

  // Fetch and validate the signing certificate
  const certificate = await fetchPayPalCertificate(certUrl);
  if (!certificate) {
    return false;
  }

  // Construct the expected message per PayPal's specification:
  // transmissionId|transmissionTime|webhookId|crc32(body)
  const bodyCrc = crc32(body);
  const expectedMessage = `${transmissionId}|${transmissionTime}|${PAYPAL_WEBHOOK_ID}|${bodyCrc}`;

  // Verify the signature using SHA256withRSA (or the algorithm specified in the header)
  try {
    const algorithm = authAlgo === "SHA256withRSA" ? "RSA-SHA256" : "RSA-SHA256";
    const verifier = createVerify(algorithm);
    verifier.update(expectedMessage);
    return verifier.verify(certificate, transmissionSig, "base64");
  } catch {
    return false;
  }
}

async function handlePaymentCaptureCompleted(resource: Record<string, unknown>) {
  // Process successful payment capture:
  // 1. Update order status to paid
  // 2. Hold funds in escrow
  // 3. Notify seller of new order
  void resource;
}

async function handlePaymentCaptureDenied(resource: Record<string, unknown>) {
  // Handle denied payment:
  // 1. Update order status to failed
  // 2. Notify buyer
  void resource;
}

async function handleDisputeCreated(resource: Record<string, unknown>) {
  // Handle PayPal dispute:
  // 1. Freeze escrow funds
  // 2. Notify admin
  // 3. Update order status
  void resource;
}

async function handleDisputeResolved(resource: Record<string, unknown>) {
  // Handle dispute resolution:
  // 1. Process based on outcome (buyer/seller favor)
  // 2. Release or refund escrow
  // 3. Update records
  void resource;
}

export async function POST(request: Request) {
  try {
    const body = await request.text();

    // Verify webhook signature using certificate-based verification
    const isValid = await verifyPayPalSignature(request, body);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const eventType: string = event.event_type;
    const resource = event.resource || {};

    // Route event to appropriate handler
    switch (eventType) {
      case "PAYMENT.CAPTURE.COMPLETED":
        await handlePaymentCaptureCompleted(resource);
        break;
      case "PAYMENT.CAPTURE.DENIED":
        await handlePaymentCaptureDenied(resource);
        break;
      case "CUSTOMER.DISPUTE.CREATED":
        await handleDisputeCreated(resource);
        break;
      case "CUSTOMER.DISPUTE.RESOLVED":
        await handleDisputeResolved(resource);
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
