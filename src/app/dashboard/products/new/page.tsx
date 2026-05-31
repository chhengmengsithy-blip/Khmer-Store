import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { SellerProductForm } from "@/features/dashboard/components/seller-product-form";
import { BecomeSellerForm } from "@/features/dashboard/components/become-seller-form";

export default async function NewProductPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Look up users_extended to get the extended user id
  const { data: extUser } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  // Check if user has a seller record
  let hasSeller = false;
  if (extUser) {
    const { data: seller } = await supabase
      .from("sellers")
      .select("id")
      .eq("user_id", extUser.id)
      .single();
    hasSeller = !!seller;
  }

  return (
    <FadeIn className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-soft-white">Add New Product</h2>
        <p className="text-sm text-muted-foreground">
          {hasSeller
            ? "Create a new product listing for your store."
            : "You need to register as a seller before posting products."}
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-surface p-6">
        {hasSeller ? <SellerProductForm /> : <BecomeSellerForm />}
      </div>
    </FadeIn>
  );
}
