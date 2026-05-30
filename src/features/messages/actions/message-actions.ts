"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getConversations() {
  const supabase = await createClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("messages")
    .select(
      "*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*), listing:listings(*)"
    )
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getMessages(otherUserId: string) {
  const supabase = await createClient();
  if (!supabase) return [];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("messages")
    .select("*, sender:profiles!sender_id(*)")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  return data || [];
}

export async function sendMessage(
  receiverId: string,
  content: string,
  listingId?: string
) {
  const supabase = await createClient();
  if (!supabase) return { error: "Not configured" };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required" };

  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    receiver_id: receiverId,
    content,
    listing_id: listingId || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/messages");
  return { error: null };
}

export async function markAsRead(messageId: string) {
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("messages").update({ is_read: true }).eq("id", messageId);
}
