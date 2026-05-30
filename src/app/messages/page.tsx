"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Loader2,
  User,
  Search,
  ArrowLeft,
  Package,
} from "lucide-react";
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
  listing: { id: string; title: string; images?: string[]; price?: number } | null;
}

function formatMessageDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<ConversationMessage[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          listing: msg.listing,
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
        listing: ConversationMessage["listing"];
      }
    >
  );

  const conversationList = Object.values(conversationGroups).filter((conv) => {
    if (!searchQuery) return true;
    const name = conv.profile?.full_name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedConv = selectedUserId
    ? conversationGroups[selectedUserId]
    : null;

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

        {conversationList.length === 0 && !searchQuery ? (
          <EmptyState
            icon={MessageSquare}
            title="No messages yet"
            description="Messages will appear here when you contact sellers or buyers contact you."
            actionLabel="Browse Marketplace"
            actionHref="/marketplace"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-14rem)] rounded-xl border border-white/[0.08] overflow-hidden">
            {/* Conversation List - Left Panel */}
            <div
              className={`border-r border-white/[0.08] bg-surface flex flex-col ${
                selectedUserId ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Search */}
              <div className="p-4 border-b border-white/[0.06]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="pl-9 border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 h-9"
                  />
                </div>
              </div>

              {/* Conversation Items */}
              <div className="flex-1 overflow-y-auto">
                {conversationList.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-sm text-muted-foreground">
                      No conversations found
                    </p>
                  </div>
                ) : (
                  conversationList.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => selectConversation(conv.userId)}
                      className={`w-full flex items-center gap-3 p-4 text-left border-b border-white/[0.04] transition-colors hover:bg-elevated ${
                        selectedUserId === conv.userId
                          ? "bg-elevated border-l-2 border-l-accent-gold"
                          : ""
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-gold/10">
                        {conv.profile?.avatar_url ? (
                          <img
                            src={conv.profile.avatar_url}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-accent-gold" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-soft-white truncate">
                            {conv.profile?.full_name || "User"}
                          </p>
                          <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                            {timeAgo(conv.lastMessage.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {conv.lastMessage.sender_id === user.id && (
                            <span className="text-muted-foreground/60">
                              You:{" "}
                            </span>
                          )}
                          {conv.lastMessage.content}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-gold text-[10px] text-background font-bold px-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area - Right Panel */}
            <div
              className={`md:col-span-2 flex flex-col bg-background ${
                selectedUserId ? "flex" : "hidden md:flex"
              }`}
            >
              {selectedUserId && selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 p-4 border-b border-white/[0.08] bg-surface">
                    <button
                      onClick={() => setSelectedUserId(null)}
                      className="md:hidden text-muted-foreground hover:text-soft-white"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-gold/10">
                      {selectedConv.profile?.avatar_url ? (
                        <img
                          src={selectedConv.profile.avatar_url}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-accent-gold" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-soft-white truncate">
                        {selectedConv.profile?.full_name || "User"}
                      </p>
                    </div>
                    {selectedConv.listing && (
                      <a
                        href={`/listing/${selectedConv.listing.id}`}
                        className="text-xs text-accent-gold hover:underline shrink-0"
                      >
                        View Listing
                      </a>
                    )}
                  </div>

                  {/* Listing Reference Card */}
                  {selectedConv.listing && (
                    <div className="px-4 py-2 border-b border-white/[0.06] bg-surface/50">
                      <a
                        href={`/listing/${selectedConv.listing.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg bg-elevated/50 hover:bg-elevated transition-colors"
                      >
                        <div className="h-10 w-10 rounded bg-elevated overflow-hidden shrink-0">
                          {selectedConv.listing.images?.[0] ? (
                            <img
                              src={selectedConv.listing.images[0]}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-soft-white truncate">
                            {selectedConv.listing.title}
                          </p>
                          {selectedConv.listing.price && (
                            <p className="text-xs text-accent-gold font-mono">
                              ${selectedConv.listing.price.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </a>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {messages.map((msg, index) => {
                      const showDate =
                        index === 0 ||
                        formatMessageDate(msg.created_at) !==
                          formatMessageDate(messages[index - 1].created_at);

                      return (
                        <div key={msg.id}>
                          {showDate && (
                            <div className="flex items-center justify-center my-4">
                              <span className="text-[10px] text-muted-foreground bg-elevated px-3 py-1 rounded-full">
                                {formatMessageDate(msg.created_at)}
                              </span>
                            </div>
                          )}
                          <div
                            className={`flex mb-2 ${
                              msg.sender_id === user.id
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                                msg.sender_id === user.id
                                  ? "bg-accent-gold/15 text-soft-white rounded-br-md"
                                  : "bg-elevated text-soft-white rounded-bl-md"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {msg.content}
                              </p>
                              <p
                                className={`mt-1 text-[10px] ${
                                  msg.sender_id === user.id
                                    ? "text-accent-gold/60"
                                    : "text-muted-foreground/60"
                                }`}
                              >
                                {new Date(msg.created_at).toLocaleTimeString(
                                  "en-US",
                                  {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form
                    onSubmit={handleSend}
                    className="flex items-center gap-2 border-t border-white/[0.08] p-4 bg-surface"
                  >
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 rounded-full"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={sending || !newMessage.trim()}
                      className="bg-accent-gold text-background hover:bg-accent-gold/90 shrink-0 rounded-full h-10 w-10"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10">
                    <MessageSquare className="h-8 w-8 text-accent-gold" />
                  </div>
                  <div className="text-center">
                    <p className="text-soft-white font-medium">
                      Select a conversation
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
