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

/**
 * Creates an order with status "pending" and then creates a Stripe PaymentIntent
 * with the order_id in metadata. The webhook will update the order to "confirmed"
 * on payment_intent.succeeded using the order_id from metadata directly.
 *
 * NOTE: Multi-seller cart limitation - all items are assigned to the first item's
 * seller_id because the orders table only has a single seller_id column. Supporting
 * multiple sellers per order would require an order_items table which does not exist
 * in the current schema. For now, carts with items from different sellers will have
 * all items lumped under one order assigned to the first seller.
 */
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
  });

  // Calculate commission (3% platform fee)
  const commission = totalAmount * 0.03;

  // Create the order FIRST with status "pending"
  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      buyer_id: extUser.id,
      seller_id: primarySellerId,
      status: "pending",
      total: totalAmount,
      commission,
      escrow_status: "pending",
      shipping_address: shippingAddress,
      notes: notesJson,
    })
    .select("id")
    .single();

  if (insertError || !order) {
    return { error: insertError?.message || "Failed to create order." };
  }

  // Convert amount to cents for Stripe
  const amountInCents = Math.round(totalAmount * 100);

  try {
    // Create PaymentIntent with order_id in metadata for webhook lookup
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: {
        order_id: order.id,
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

    // Store the payment_intent_id in the order notes for reference
    const updatedNotes = JSON.stringify({
      items: items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      payment_intent_id: paymentIntent.id,
    });

    await supabase
      .from("orders")
      .update({ notes: updatedNotes })
      .eq("id", order.id);

    return {
      success: true,
      clientSecret: paymentIntent.client_secret || undefined,
      orderId: order.id,
    };
  } catch (err) {
    // If Stripe fails, cancel the pending order
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id);

    const message =
      err instanceof Error ? err.message : "Failed to create payment intent.";
    return { error: message };
  }
}
