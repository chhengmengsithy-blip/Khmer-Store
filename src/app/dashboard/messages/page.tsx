import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getConversations } from "@/features/dashboard/actions/message-actions";
import { MessagesClient } from "@/features/dashboard/components/messages-client";

export default async function MessagesPage() {
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

  const result = await getConversations();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-soft-white">Messages</h2>
        <p className="text-sm text-muted-foreground">
          Chat with buyers and sellers.
        </p>
      </div>

      <MessagesClient
        userId={result.userId || extUser.id}
        initialConversations={result.conversations || []}
      />
    </div>
  );
}
