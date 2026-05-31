"use server";

import { createClient } from "@/lib/supabase/server";

interface ReviewResult {
  success?: boolean;
  error?: string;
}

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
  user: {
    display_name: string;
  };
}

export async function submitReview(
  productId: string,
  rating: number,
  comment: string
): Promise<ReviewResult> {
  const supabase = await createClient();

  // Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to submit a review." };
  }

  // Get users_extended.id from auth_user_id
  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return { error: "User profile not found." };
  }

  // Check if user already reviewed this product (prevent duplicates)
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("user_id", extUser.id)
    .single();

  if (existingReview) {
    return { error: "You have already reviewed this product." };
  }

  // Check verified_purchase: query orders table where buyer_id = user's extended id
  // AND status IN ('confirmed','delivered') AND notes LIKE product_id
  const { data: orders } = await supabase
    .from("orders")
    .select("id, notes")
    .eq("buyer_id", extUser.id)
    .in("status", ["confirmed", "delivered"]);

  let verifiedPurchase = false;
  if (orders && orders.length > 0) {
    verifiedPurchase = orders.some((order) => {
      if (!order.notes) return false;
      return order.notes.includes(productId);
    });
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5." };
  }

  // Validate comment length
  if (comment && comment.trim().length > 2000) {
    return { error: "Comment must be 2000 characters or fewer." };
  }
  // Trim and treat whitespace-only comments as empty
  const trimmedComment = comment ? comment.trim() : "";

  // Insert into reviews
  const { error: insertError } = await supabase.from("reviews").insert({
    product_id: productId,
    user_id: extUser.id,
    rating,
    comment: trimmedComment,
    verified_purchase: verifiedPurchase,
  });

  if (insertError) {
    return { error: insertError.message || "Failed to submit review." };
  }

  return { success: true };
}

export async function getProductReviews(
  productId: string
): Promise<ReviewData[]> {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      comment,
      verified_purchase,
      created_at,
      users_extended!inner(display_name)
    `
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error || !reviews) {
    return [];
  }

  return reviews.map((review) => ({
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    verified_purchase: review.verified_purchase,
    created_at: review.created_at,
    user: {
      display_name:
        (review.users_extended as unknown as { display_name: string })
          ?.display_name || "Anonymous",
    },
  }));
}

export async function getAverageRating(
  productId: string
): Promise<{ average: number; count: number }> {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId);

  if (error || !reviews || reviews.length === 0) {
    return { average: 0, count: 0 };
  }

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    average: total / reviews.length,
    count: reviews.length,
  };
}
