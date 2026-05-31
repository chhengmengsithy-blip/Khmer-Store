"use server";

import { createClient } from "@/lib/supabase/server";

const PAYPAL_API =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

interface PayPalResult {
  success?: boolean;
  orderId?: string;
  approvalUrl?: string;
  paypalOrderId?: string;
  error?: string;
}

interface CartItemData {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  seller_id: string;
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const secret = process.env.PAYPAL_SECRET || "";

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await response.json();
  return data.access_token;
}

export async function createPayPalOrder(
  items: CartItemData[],
  totalAmount: number,
  shippingAddress: string
): Promise<PayPalResult> {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to checkout." };
  }

  // Look up users_extended
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
    payment_method: "paypal",
  });

  // Calculate commission (3% platform fee)
  const commission = totalAmount * 0.03;

  // Create the order in supabase with status 'pending'
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

  try {
    // Get PayPal access token
    const accessToken = await getPayPalAccessToken();

    // Create PayPal order
    const paypalResponse = await fetch(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: totalAmount.toFixed(2),
              },
              description: `Khmer Store Order - ${items.length} item(s)`,
            },
          ],
          application_context: {
            brand_name: "Khmer Store",
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/orders`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout`,
          },
        }),
      }
    );

    if (!paypalResponse.ok) {
      throw new Error("Failed to create PayPal order");
    }

    const paypalData = await paypalResponse.json();

    // Find approval link
    const approvalLink = paypalData.links?.find(
      (link: { rel: string; href: string }) => link.rel === "approve"
    );

    // Store paypal order id in supabase order notes
    const updatedNotes = JSON.stringify({
      items: items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      payment_method: "paypal",
      paypal_order_id: paypalData.id,
    });

    await supabase
      .from("orders")
      .update({ notes: updatedNotes })
      .eq("id", order.id);

    return {
      success: true,
      orderId: order.id,
      approvalUrl: approvalLink?.href || undefined,
      paypalOrderId: paypalData.id,
    };
  } catch (err) {
    // If PayPal fails, cancel the pending order
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id);

    const message =
      err instanceof Error ? err.message : "Failed to create PayPal order.";
    return { error: message };
  }
}

export async function capturePayPalOrder(
  paypalOrderId: string,
  supabaseOrderId: string
): Promise<PayPalResult> {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to complete payment." };
  }

  // Get users_extended id
  const { data: extUser } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!extUser) {
    return { error: "User profile not found." };
  }

  // Verify order ownership
  const { data: order } = await supabase
    .from("orders")
    .select("id, buyer_id, notes")
    .eq("id", supabaseOrderId)
    .single();

  if (!order || order.buyer_id !== extUser.id) {
    return { error: "Order not found or unauthorized." };
  }

  try {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to capture PayPal payment");
    }

    const data = await response.json();

    if (data.status === "COMPLETED") {
      // Update supabase order status to 'confirmed'
      await supabase
        .from("orders")
        .update({ status: "confirmed", escrow_status: "held" })
        .eq("id", supabaseOrderId);

      return { success: true, orderId: supabaseOrderId };
    }

    return { error: "Payment capture was not completed." };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to capture PayPal payment.";
    return { error: message };
  }
}
