"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag, MapPin, CreditCard, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CartSummary } from "./cart-summary";
import { PaymentMethodSelector } from "./payment-method-selector";
import { cn } from "@/lib/utils";

const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const steps = [
  { id: 1, name: "Review Cart", icon: ShoppingBag },
  { id: 2, name: "Shipping", icon: MapPin },
  { id: 3, name: "Payment", icon: CreditCard },
  { id: 4, name: "Confirmation", icon: Check },
];

export function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
  });

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, 4));
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
              {currentStep === 3 && (
                <StepPayment
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              )}
              {currentStep === 4 && <StepConfirmation />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="mt-6 flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  className="border-white/10 text-muted-foreground"
                  onClick={goBack}
                >
                  Back
                </Button>
              )}
              <Button
                className="bg-accent-gold text-background hover:bg-accent-gold/90"
                onClick={goNext}
              >
                {currentStep === 3 ? "Place Order" : "Continue"}
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

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
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

function StepConfirmation() {
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
      <div className="rounded-lg bg-elevated px-4 py-2">
        <span className="text-xs text-muted-foreground">Order ID: </span>
        <span className="text-sm font-mono text-accent-gold">
          #KS-2024-00847
        </span>
      </div>
      <Button className="mt-4 bg-accent-gold text-background hover:bg-accent-gold/90">
        View Order Details
      </Button>
    </div>
  );
}
