import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrdersTable } from "@/features/dashboard/components/orders-table";
import type { Order } from "@/types";

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/sign-in");
  }

  // Look up users_extended to get the extended user id
  const { data: extUser } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!extUser) {
    redirect("/auth/sign-in");
  }

  // Check if user has a seller record
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", extUser.id)
    .single();

  // Fetch orders where the user is either the buyer or the seller
  let orders: Order[] = [];

  if (seller) {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .or(`buyer_id.eq.${extUser.id},seller_id.eq.${seller.id}`)
      .order("created_at", { ascending: false });

    orders = (data as Order[]) || [];
  } else {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("buyer_id", extUser.id)
      .order("created_at", { ascending: false });

    orders = (data as Order[]) || [];
  }

  const isSeller = !!seller;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-soft-white">Orders</h2>
        <p className="text-sm text-muted-foreground">
          Manage and track all your orders.
        </p>
      </div>

      <OrdersTable orders={orders} isSeller={isSeller} />
    </div>
  );
}
