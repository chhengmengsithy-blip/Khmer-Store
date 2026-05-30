"use server";

import { createClient } from "@/lib/supabase/server";

interface ActionResult {
  success?: boolean;
  error?: string;
}

export interface ConversationPartner {
  partnerId: string;
  displayName: string;
  avatarUrl: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
}

export async function getConversations(): Promise<{
  conversations?: ConversationPartner[];
  userId?: string;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to view messages." };
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

  const currentUserId = extUser.id;

  // Fetch all messages involving the current user (not deleted)
  const { data: messages, error: msgError } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, content, read_at, created_at")
    .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (msgError) {
    return { error: msgError.message };
  }

  if (!messages || messages.length === 0) {
    return { conversations: [], userId: currentUserId };
  }

  // Group by conversation partner
  const partnerMap = new Map<
    string,
    { lastMessage: string; lastMessageAt: string; unreadCount: number }
  >();

  for (const msg of messages) {
    const partnerId =
      msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;

    if (!partnerMap.has(partnerId)) {
      partnerMap.set(partnerId, {
        lastMessage: msg.content,
        lastMessageAt: msg.created_at,
        unreadCount: 0,
      });
    }

    // Count unread messages from this partner
    if (msg.sender_id === partnerId && !msg.read_at) {
      const entry = partnerMap.get(partnerId)!;
      entry.unreadCount += 1;
    }
  }

  // Fetch profiles for all partners
  const partnerIds = Array.from(partnerMap.keys());
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, display_name, full_name, avatar_url")
    .in("user_id", partnerIds);

  const profileMap = new Map<
    string,
    { displayName: string; avatarUrl: string | null }
  >();
  if (profiles) {
    for (const p of profiles) {
      profileMap.set(p.user_id, {
        displayName: p.display_name || p.full_name || "Unknown User",
        avatarUrl: p.avatar_url,
      });
    }
  }

  const conversations: ConversationPartner[] = partnerIds.map((partnerId) => {
    const entry = partnerMap.get(partnerId)!;
    const profile = profileMap.get(partnerId);
    return {
      partnerId,
      displayName: profile?.displayName || "Unknown User",
      avatarUrl: profile?.avatarUrl || null,
      lastMessage: entry.lastMessage,
      lastMessageAt: entry.lastMessageAt,
      unreadCount: entry.unreadCount,
    };
  });

  // Sort by most recent message
  conversations.sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() -
      new Date(a.lastMessageAt).getTime()
  );

  return { conversations, userId: currentUserId };
}

export async function getMessages(
  partnerId: string
): Promise<{ messages?: Message[]; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to view messages." };
  }

  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return { error: "User profile not found." };
  }

  const currentUserId = extUser.id;

  const { data, error: msgError } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, content, read_at, created_at")
    .or(
      `and(sender_id.eq.${currentUserId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${currentUserId})`
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (msgError) {
    return { error: msgError.message };
  }

  const formatted: Message[] = (data || []).map((msg) => ({
    id: msg.id,
    senderId: msg.sender_id,
    receiverId: msg.receiver_id,
    content: msg.content,
    readAt: msg.read_at,
    createdAt: msg.created_at,
  }));

  return { messages: formatted };
}

export async function sendMessage(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in to send messages." };
  }

  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return { error: "User profile not found." };
  }

  const receiverId = formData.get("receiver_id") as string | null;
  const content = formData.get("content") as string | null;

  if (!receiverId) {
    return { error: "Receiver is required." };
  }

  if (!content || content.trim().length === 0) {
    return { error: "Message content is required." };
  }

  if (content.length > 5000) {
    return { error: "Message must be 5,000 characters or fewer." };
  }

  const { error: insertError } = await supabase.from("messages").insert({
    sender_id: extUser.id,
    receiver_id: receiverId,
    content: content.trim(),
  });

  if (insertError) {
    return { error: insertError.message };
  }

  return { success: true };
}

export async function markAsRead(partnerId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be signed in." };
  }

  const { data: extUser, error: extError } = await supabase
    .from("users_extended")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (extError || !extUser) {
    return { error: "User profile not found." };
  }

  const { error: updateError } = await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("sender_id", partnerId)
    .eq("receiver_id", extUser.id)
    .is("read_at", null);

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true };
}
