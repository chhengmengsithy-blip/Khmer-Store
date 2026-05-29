/**
 * Payment Service
 *
 * Unified payment abstraction supporting multiple providers (Stripe, PayPal).
 * All payment operations go through this service layer.
 */

export type PaymentProvider = "stripe" | "paypal";
export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled"
  | "refunded";

export type PaymentMethodType =
  | "card"
  | "bank_transfer"
  | "paypal"
  | "crypto";

export interface PaymentIntent {
  id: string;
  provider: PaymentProvider;
  amount: number;
  currency: string;
  status: PaymentStatus;
  clientSecret: string | null;
  paymentMethodType: PaymentMethodType;
  metadata: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  provider: PaymentProvider;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  email?: string; // For PayPal
  isDefault: boolean;
}

export interface CreatePaymentIntentParams {
  amount: number;
  currency?: string;
  provider: PaymentProvider;
  paymentMethodType: PaymentMethodType;
  orderId: string;
  buyerId: string;
  sellerId: string;
  metadata?: Record<string, string>;
}

export interface ProcessPaymentParams {
  paymentIntentId: string;
  paymentMethodId: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  provider: PaymentProvider;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface WebhookVerificationResult {
  valid: boolean;
  event: WebhookEvent | null;
  error?: string;
}

/**
 * Create a payment intent with the specified provider.
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentIntent> {
  const {
    amount,
    currency = "USD",
    provider,
    paymentMethodType,
    orderId,
    buyerId,
    sellerId,
    metadata = {},
  } = params;

  // In production, this would call the appropriate provider API:
  // - Stripe: stripe.paymentIntents.create()
  // - PayPal: paypal.orders.create()
  const intent: PaymentIntent = {
    id: `pi_${provider}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    provider,
    amount,
    currency,
    status: "pending",
    clientSecret: provider === "stripe" ? `cs_${Date.now()}_secret` : null,
    paymentMethodType,
    metadata: {
      ...metadata,
      orderId,
      buyerId,
      sellerId,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return intent;
}

/**
 * Process a payment using a payment method.
 */
export async function processPayment(
  params: ProcessPaymentParams
): Promise<PaymentIntent> {
  const { paymentIntentId } = params;

  // In production, this would:
  // 1. Retrieve the payment intent from the provider
  // 2. Confirm/capture the payment
  // 3. Update local records
  const result: PaymentIntent = {
    id: paymentIntentId,
    provider: "stripe",
    amount: 0,
    currency: "USD",
    status: "succeeded",
    clientSecret: null,
    paymentMethodType: "card",
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return result;
}

/**
 * Verify a webhook signature from a payment provider.
 */
export async function verifyWebhook(
  provider: PaymentProvider,
  payload: string,
  signature: string,
  secret: string
): Promise<WebhookVerificationResult> {
  // In production, this would use provider-specific verification:
  // - Stripe: stripe.webhooks.constructEvent(payload, signature, secret)
  // - PayPal: verify HMAC signature against webhook ID

  if (!payload || !signature || !secret) {
    return { valid: false, event: null, error: "Missing required parameters" };
  }

  // Stub: signature verification would happen here
  const event: WebhookEvent = {
    id: `evt_${Date.now()}`,
    type: "payment_intent.succeeded",
    provider,
    data: JSON.parse(payload || "{}"),
    createdAt: new Date().toISOString(),
  };

  return { valid: true, event };
}

/**
 * Get stored payment methods for a user.
 */
export async function getPaymentMethods(
  userId: string
): Promise<PaymentMethod[]> {
  // In production, this would query stored payment methods from the database
  // and optionally sync with provider APIs
  void userId;

  return [
    {
      id: "pm_1",
      type: "card",
      provider: "stripe",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true,
    },
    {
      id: "pm_2",
      type: "paypal",
      provider: "paypal",
      email: "user@example.com",
      isDefault: false,
    },
  ];
}
