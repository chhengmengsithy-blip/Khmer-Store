"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { useAuthStore } from "@/stores/auth-store";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "@/features/messages/actions/message-actions";
import { timeAgo } from "@/lib/utils";
import type { Profile } from "@/types";

interface ConversationMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender: Profile | null;
  receiver: Profile | null;
  listing: { id: string; title: string } | null;
}

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<ConversationMessage[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }
      const data = await getConversations();
      setConversations(data as ConversationMessage[]);
      setLoading(false);
    }
    load();
  }, [user]);

  // Group conversations by other user
  const conversationGroups = conversations.reduce(
    (acc, msg) => {
      const otherId =
        msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
      if (!acc[otherId]) {
        const otherProfile =
          msg.sender_id === user?.id ? msg.receiver : msg.sender;
        acc[otherId] = {
          userId: otherId,
          profile: otherProfile,
          lastMessage: msg,
          unreadCount: 0,
        };
      }
      if (!msg.is_read && msg.receiver_id === user?.id) {
        acc[otherId].unreadCount++;
      }
      return acc;
    },
    {} as Record<
      string,
      {
        userId: string;
        profile: Profile | null;
        lastMessage: ConversationMessage;
        unreadCount: number;
      }
    >
  );

  const conversationList = Object.values(conversationGroups);

  async function selectConversation(userId: string) {
    setSelectedUserId(userId);
    const msgs = await getMessages(userId);
    setMessages(msgs as ConversationMessage[]);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;
    setSending(true);
    await sendMessage(selectedUserId, newMessage.trim());
    setNewMessage("");
    // Refresh messages
    const msgs = await getMessages(selectedUserId);
    setMessages(msgs as ConversationMessage[]);
    setSending(false);
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <EmptyState
            icon={MessageSquare}
            title="Sign in to view messages"
            description="You need to be signed in to send and receive messages."
            actionLabel="Sign In"
            actionHref="/sign-in"
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold text-soft-white font-playfair mb-6">
          Messages
        </h1>

        {conversationList.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No messages yet"
            description="Messages will appear here when you contact sellers or buyers contact you."
            actionLabel="Browse Marketplace"
            actionHref="/marketplace"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 h-[calc(100vh-14rem)]">
            {/* Conversation List */}
            <div className="overflow-y-auto rounded-lg border border-white/[0.08] bg-surface">
              {conversationList.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() => selectConversation(conv.userId)}
                  className={`w-full flex items-center gap-3 p-4 text-left border-b border-white/[0.06] transition-colors hover:bg-elevated ${
                    selectedUserId === conv.userId ? "bg-elevated" : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-gold/10">
                    <User className="h-5 w-5 text-accent-gold" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-soft-white truncate">
                        {conv.profile?.full_name || "User"}
                      </p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {timeAgo(conv.lastMessage.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conv.lastMessage.content}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-gold text-xs text-background font-medium">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Message Thread */}
            <div className="md:col-span-2 flex flex-col rounded-lg border border-white/[0.08] bg-surface">
              {selectedUserId ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_id === user.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 ${
                            msg.sender_id === user.id
                              ? "bg-accent-gold/20 text-soft-white"
                              : "bg-elevated text-soft-white"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {timeAgo(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    onSubmit={handleSend}
                    className="flex items-center gap-2 border-t border-white/[0.08] p-4"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={sending || !newMessage.trim()}
                      className="bg-accent-gold text-background hover:bg-accent-gold/90 shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Select a conversation to start messaging
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
