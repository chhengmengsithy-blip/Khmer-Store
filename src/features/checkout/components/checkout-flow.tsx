"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ShoppingBag,
  MapPin,
  CreditCard,
  PartyPopper,
  Loader2,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartSummary } from "./cart-summary";
import { PaymentMethodSelector } from "./payment-method-selector";
import { useCartStore } from "@/stores/cart-store";
import { createPaymentIntent } from "@/features/checkout/actions/checkout-actions";
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "@/features/checkout/actions/paypal-actions";
import { cn } from "@/lib/utils";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const steps = [
  { id: 1, name: "Review Cart", icon: ShoppingBag },
  { id: 2, name: "Shipping", icon: MapPin },
  { id: 3, name: "Payment", icon: CreditCard },
  { id: 4, name: "Confirmation", icon: Check },
];

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
}

export function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
  });

  const { items, total, clearCart } = useCartStore();

  const getShippingAddress = useCallback(() => {
    return `${shippingInfo.fullName}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country} ${shippingInfo.postalCode}`;
  }, [shippingInfo]);

  const handleContinueToPayment = async () => {
    setError(null);
    setLoading(true);

    // Validate shipping info
    if (
      !shippingInfo.fullName ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.country
    ) {
      setError("Please fill in all required shipping fields.");
      setLoading(false);
      return;
    }

    const cartItems = items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      seller_id: item.product.seller_id,
    }));

    const totalAmount = total();

    if (paymentMethod === "paypal") {
      // PayPal flow
      const result = await createPayPalOrder(
        cartItems,
        totalAmount,
        getShippingAddress()
      );

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result.approvalUrl) {
        setApprovalUrl(result.approvalUrl);
      }
      if (result.orderId) {
        setOrderId(result.orderId);
      }
      if (result.paypalOrderId) {
        setPaypalOrderId(result.paypalOrderId);
      }

      setLoading(false);
      setCurrentStep(3);
    } else {
      // Stripe flow
      const result = await createPaymentIntent(
        cartItems,
        totalAmount,
        getShippingAddress()
      );

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
      }
      if (result.orderId) {
        setOrderId(result.orderId);
      }

      setLoading(false);
      setCurrentStep(3);
    }
  };

  // Payment succeeded - the order was already created in "pending" status before payment.
  // The webhook will update it to "confirmed". We just navigate to the confirmation step.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePaymentSuccess = async (_paymentIntentId: string) => {
    clearCart();
    setCurrentStep(4);
  };

  const goNext = () => {
    if (currentStep === 2) {
      handleContinueToPayment();
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 4));
  };

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-all",
                    currentStep > step.id
                      ? "border-accent-gold bg-accent-gold text-background"
                      : currentStep === step.id
                        ? "border-accent-gold text-accent-gold"
                        : "border-white/20 text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "hidden text-xs sm:block",
                    currentStep >= step.id
                      ? "text-soft-white"
                      : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-px w-8 sm:w-12",
                    currentStep > step.id ? "bg-accent-gold" : "bg-white/10"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: premiumEasing }}
            >
              {currentStep === 1 && <StepReviewCart />}
              {currentStep === 2 && (
                <StepShipping info={shippingInfo} onChange={setShippingInfo} />
              )}
              {currentStep === 3 && clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance: { theme: "night" } }}
                >
                  <StepStripePayment
                    onSuccess={handlePaymentSuccess}
                    onError={(msg) => setError(msg)}
                  />
                </Elements>
              )}
              {currentStep === 3 && paymentMethod === "paypal" && approvalUrl && (
                <StepPayPalPayment
                  approvalUrl={approvalUrl}
                  paypalOrderId={paypalOrderId}
                  supabaseOrderId={orderId}
                  onSuccess={() => {
                    clearCart();
                    setCurrentStep(4);
                  }}
                  onError={(msg) => setError(msg)}
                />
              )}
              {currentStep === 3 && !clientSecret && paymentMethod !== "paypal" && (
                <StepPayment
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              )}
              {currentStep === 4 && <StepConfirmation orderId={orderId} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {currentStep < 3 && (
            <div className="mt-6 flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  className="border-white/10 text-muted-foreground"
                  onClick={goBack}
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              <Button
                className="bg-accent-gold text-background hover:bg-accent-gold/90"
                onClick={goNext}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        {currentStep < 4 && (
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}

function StepReviewCart() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-soft-white">
        Review Your Cart
      </h2>
      <p className="text-sm text-muted-foreground">
        Review the items in your cart before proceeding to checkout.
      </p>
      <CartSummary />
    </div>
  );
}

function StepShipping({
  info,
  onChange,
}: {
  info: ShippingInfo;
  onChange: (info: ShippingInfo) => void;
}) {
  const update = (field: keyof ShippingInfo, value: string) =>
    onChange({ ...info, [field]: value });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-soft-white">
        Shipping Address
      </h2>
      <p className="text-sm text-muted-foreground">
        Enter your delivery address.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-soft-white">Full Name</Label>
          <Input
            value={info.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            className="bg-elevated border-white/10"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-soft-white">Address</Label>
          <Input
            value={info.address}
            onChange={(e) => update("address", e.target.value)}
            className="bg-elevated border-white/10"
            placeholder="123 Street Name"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-soft-white">City</Label>
          <Input
            value={info.city}
            onChange={(e) => update("city", e.target.value)}
            className="bg-elevated border-white/10"
            placeholder="Phnom Penh"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-soft-white">Country</Label>
          <Input
            value={info.country}
            onChange={(e) => update("country", e.target.value)}
            className="bg-elevated border-white/10"
            placeholder="Cambodia"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-soft-white">Postal Code</Label>
          <Input
            value={info.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
            className="bg-elevated border-white/10"
            placeholder="12000"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-soft-white">Phone</Label>
          <Input
            value={info.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="bg-elevated border-white/10"
            placeholder="+855 12 345 678"
          />
        </div>
      </div>
    </div>
  );
}

function StepPayment({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (method: string) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-soft-white">Payment Method</h2>
      <p className="text-sm text-muted-foreground">
        Choose how you would like to pay for your order.
      </p>
      <PaymentMethodSelector selected={selected} onSelect={onSelect} />
    </div>
  );
}

function StepStripePayment({
  onSuccess,
  onError,
}: {
  onSuccess: (paymentIntentId: string) => void;
  onError: (message: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/orders`,
      },
      redirect: "if_required",
    });

    if (error) {
      onError(error.message || "Payment failed. Please try again.");
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      onError("Payment was not completed. Please try again.");
    }

    setProcessing(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-soft-white">
        Enter Payment Details
      </h2>
      <p className="text-sm text-muted-foreground">
        Complete your payment securely via Stripe.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-white/[0.06] bg-surface p-4">
          <PaymentElement />
        </div>
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="w-full bg-accent-gold text-background hover:bg-accent-gold/90"
        >
          {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {processing ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
}

function StepPayPalPayment({
  approvalUrl,
  paypalOrderId,
  supabaseOrderId,
  onSuccess,
  onError,
}: {
  approvalUrl: string;
  paypalOrderId: string | null;
  supabaseOrderId: string | null;
  onSuccess: () => void;
  onError: (message: string) => void;
}) {
  const [processing, setProcessing] = useState(false);
  const [paypalWindowOpened, setPaypalWindowOpened] = useState(false);

  const handleOpenPayPal = () => {
    window.open(approvalUrl, "_blank", "noopener,noreferrer");
    setPaypalWindowOpened(true);
  };

  const handleCompletePayment = async () => {
    if (!paypalOrderId || !supabaseOrderId) {
      onError("Missing order information. Please try again.");
      return;
    }

    setProcessing(true);
    try {
      const result = await capturePayPalOrder(paypalOrderId, supabaseOrderId);
      if (result.error) {
        onError(result.error);
      } else {
        onSuccess();
      }
    } catch {
      onError("Failed to complete payment. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-soft-white">
        Pay with PayPal
      </h2>
      <p className="text-sm text-muted-foreground">
        You will be redirected to PayPal to complete your payment securely.
      </p>
      <div className="rounded-xl border border-white/[0.06] bg-surface p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0070ba]/10">
            <span className="text-lg font-bold text-[#0070ba]">P</span>
          </div>
          <div>
            <p className="text-sm font-medium text-soft-white">PayPal Checkout</p>
            <p className="text-xs text-muted-foreground">
              Secure payment via PayPal
            </p>
          </div>
        </div>

        {!paypalWindowOpened ? (
          <Button
            onClick={handleOpenPayPal}
            className="w-full bg-[#0070ba] text-white hover:bg-[#005ea6]"
          >
            Open PayPal
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground text-center">
              After completing payment in the PayPal window, click below to
              confirm your order.
            </p>
            <Button
              onClick={handleCompletePayment}
              disabled={processing}
              className="w-full bg-accent-gold text-background hover:bg-accent-gold/90"
            >
              {processing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {processing ? "Confirming..." : "Complete Payment"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepConfirmation({ orderId }: { orderId: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-white/[0.06] bg-surface p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
        <PartyPopper className="h-8 w-8 text-green-400" />
      </div>
      <h2 className="text-xl font-bold text-soft-white">Order Confirmed!</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        Your order has been placed successfully. You will receive a confirmation
        email shortly with your order details and tracking information.
      </p>
      {orderId && (
        <div className="rounded-lg bg-elevated px-4 py-2">
          <span className="text-xs text-muted-foreground">Order ID: </span>
          <span className="text-sm font-mono text-accent-gold">
            {orderId.slice(0, 8)}
          </span>
        </div>
      )}
      <Button
        className="mt-4 bg-accent-gold text-background hover:bg-accent-gold/90"
        asChild
      >
        <a href="/dashboard/orders">View Order Details</a>
      </Button>
    </div>
  );
}
