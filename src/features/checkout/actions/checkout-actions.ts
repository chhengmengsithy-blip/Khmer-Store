"use server";

import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-05-27.dahlia",
});

interface CheckoutActionResult {
  success?: boolean;
  clientSecret?: string;
  orderId?: string;
  error?: string;
}

interface CartItemData {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  seller_id: string;
}

export async function createPaymentIntent(
  items: CartItemData[],
  totalAmount: number,
  shippingAddress: string
): Promise<CheckoutActionResult> {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to checkout." };
  }

  // Look up users_extended to get the extended user id
  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return { error: "User profile not found." };
  }

  if (items.length === 0) {
    return { error: "Cart is empty." };
  }

  if (totalAmount <= 0) {
    return { error: "Invalid total amount." };
  }

  // Convert amount to cents for Stripe
  const amountInCents = Math.round(totalAmount * 100);

  // Get the primary seller_id (first item's seller)
  const primarySellerId = items[0].seller_id;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        buyer_id: extUser.id,
        seller_id: primarySellerId,
        shipping_address: shippingAddress,
        items: JSON.stringify(
          items.map((item) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
          }))
        ),
      },
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret || undefined,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create payment intent.";
    return { error: message };
  }
}

export async function createOrder(
  items: CartItemData[],
  totalAmount: number,
  shippingAddress: string,
  paymentIntentId: string
): Promise<CheckoutActionResult> {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to create an order." };
  }

  // Look up users_extended to get the extended user id
  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return { error: "User profile not found." };
  }

  if (items.length === 0) {
    return { error: "Cart is empty." };
  }

  // Get the primary seller_id (first item's seller)
  const primarySellerId = items[0].seller_id;

  // Store item details as JSON in the notes field
  const notesJson = JSON.stringify({
    items: items.map((item) => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
    })),
    payment_intent_id: paymentIntentId,
  });

  // Calculate commission (3% platform fee)
  const commission = totalAmount * 0.03;

  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      buyer_id: extUser.id,
      seller_id: primarySellerId,
      status: "confirmed",
      total: totalAmount,
      commission,
      escrow_status: "held",
      shipping_address: shippingAddress,
      notes: notesJson,
    })
    .select("id")
    .single();

  if (insertError) {
    return { error: insertError.message };
  }

  return { success: true, orderId: order.id };
}
