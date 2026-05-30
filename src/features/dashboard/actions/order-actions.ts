"use server";

import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types";

interface ActionResult {
  success?: boolean;
  error?: string;
}

const VALID_STATUS_TRANSITIONS: Record<string, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
  refunded: [],
};

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<ActionResult> {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to update order status." };
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

  // Find the seller record for this user
  const { data: seller, error: sellerError } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", extUser.id)
    .single();

  if (sellerError || !seller) {
    return { error: "Only sellers can update order status." };
  }

  // Fetch the order and verify seller ownership
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, seller_id, status")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return { error: "Order not found." };
  }

  if (order.seller_id !== seller.id) {
    return { error: "You are not authorized to update this order." };
  }

  // Validate status transition
  const allowedTransitions = VALID_STATUS_TRANSITIONS[order.status] || [];
  if (!allowedTransitions.includes(newStatus)) {
    return {
      error: `Cannot transition from "${order.status}" to "${newStatus}".`,
    };
  }

  // Update the order status
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true };
}
