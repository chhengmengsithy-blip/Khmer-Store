"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Send, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import {
  getMessages,
  sendMessage,
  markAsRead,
} from "@/features/dashboard/actions/message-actions";
import type {
  ConversationPartner,
  Message,
} from "@/features/dashboard/actions/message-actions";

interface MessagesClientProps {
  userId: string;
  initialConversations: ConversationPartner[];
}

export function MessagesClient({
  userId,
  initialConversations,
}: MessagesClientProps) {
  const [conversations, setConversations] =
    useState<ConversationPartner[]>(initialConversations);
  const [selectedPartner, setSelectedPartner] =
    useState<ConversationPartner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Subscribe to Realtime messages
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          const newMsg = payload.new as {
            id: string;
            sender_id: string;
            receiver_id: string;
            content: string;
            read_at: string | null;
            created_at: string;
          };

          const formatted: Message = {
            id: newMsg.id,
            senderId: newMsg.sender_id,
            receiverId: newMsg.receiver_id,
            content: newMsg.content,
            readAt: newMsg.read_at,
            createdAt: newMsg.created_at,
          };

          // If this message is from the currently selected partner, add to messages
          if (selectedPartner && newMsg.sender_id === selectedPartner.partnerId) {
            setMessages((prev) => [...prev, formatted]);
            // Mark as read since conversation is open
            markAsRead(newMsg.sender_id);
          }

          // Update conversations list
          setConversations((prev) => {
            const updated = [...prev];
            const idx = updated.findIndex(
              (c) => c.partnerId === newMsg.sender_id
            );
            if (idx >= 0) {
              updated[idx] = {
                ...updated[idx],
                lastMessage: newMsg.content,
                lastMessageAt: newMsg.created_at,
                unreadCount:
                  selectedPartner?.partnerId === newMsg.sender_id
                    ? updated[idx].unreadCount
                    : updated[idx].unreadCount + 1,
              };
            } else {
              // New conversation partner
              updated.unshift({
                partnerId: newMsg.sender_id,
                displayName: "New Contact",
                avatarUrl: null,
                lastMessage: newMsg.content,
                lastMessageAt: newMsg.created_at,
                unreadCount: 1,
              });
            }
            // Sort by most recent
            updated.sort(
              (a, b) =>
                new Date(b.lastMessageAt).getTime() -
                new Date(a.lastMessageAt).getTime()
            );
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, selectedPartner]);

  const handleSelectPartner = async (partner: ConversationPartner) => {
    setSelectedPartner(partner);
    setLoadingMessages(true);
    setError(null);

    const result = await getMessages(partner.partnerId);

    if (result.error) {
      setError(result.error);
      setLoadingMessages(false);
      return;
    }

    setMessages(result.messages || []);
    setLoadingMessages(false);

    // Mark messages as read
    if (partner.unreadCount > 0) {
      await markAsRead(partner.partnerId);
      setConversations((prev) =>
        prev.map((c) =>
          c.partnerId === partner.partnerId ? { ...c, unreadCount: 0 } : c
        )
      );
    }

    // Focus input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedPartner || sendingMessage) return;

    setSendingMessage(true);
    setError(null);

    const formData = new FormData();
    formData.set("receiver_id", selectedPartner.partnerId);
    formData.set("content", messageInput.trim());

    const result = await sendMessage(formData);

    if (result.error) {
      setError(result.error);
      setSendingMessage(false);
      return;
    }

    // Add the message optimistically
    const optimisticMsg: Message = {
      id: crypto.randomUUID(),
      senderId: userId,
      receiverId: selectedPartner.partnerId,
      content: messageInput.trim(),
      readAt: null,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setMessageInput("");
    setSendingMessage(false);

    // Update conversation list
    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.partnerId === selectedPartner.partnerId
          ? {
              ...c,
              lastMessage: optimisticMsg.content,
              lastMessageAt: optimisticMsg.createdAt,
            }
          : c
      );
      updated.sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime()
      );
      return updated;
    });

    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] rounded-xl border border-white/[0.06] bg-surface overflow-hidden">
      {/* Conversation List */}
      <div
        className={`w-full md:w-80 md:min-w-[320px] border-r border-white/[0.06] flex flex-col ${
          selectedPartner ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-soft-white">
            Conversations
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Messages from buyers and sellers will appear here.
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.partnerId}
                onClick={() => handleSelectPartner(conv)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-white/[0.03] ${
                  selectedPartner?.partnerId === conv.partnerId
                    ? "bg-white/[0.06]"
                    : ""
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-accent-gold/10 text-accent-gold text-xs font-semibold">
                    {getInitials(conv.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-soft-white truncate">
                      {conv.displayName}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-muted-foreground truncate">
                      {conv.lastMessage}
                    </span>
                    {conv.unreadCount > 0 && (
                      <Badge className="ml-2 shrink-0 bg-accent-gold text-background text-[10px] h-5 min-w-[20px] flex items-center justify-center">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message View */}
      <div
        className={`flex-1 flex flex-col ${
          selectedPartner ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedPartner ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/[0.06]">
              <button
                onClick={() => setSelectedPartner(null)}
                className="md:hidden text-muted-foreground hover:text-soft-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-accent-gold/10 text-accent-gold text-xs font-semibold">
                  {getInitials(selectedPartner.displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-soft-white">
                {selectedPartner.displayName}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-accent-gold" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === userId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-xl px-4 py-2 ${
                          isMine
                            ? "bg-accent-gold/20 text-soft-white"
                            : "bg-white/[0.06] text-soft-white"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                        <p
                          className={`text-[10px] mt-1 ${
                            isMine
                              ? "text-accent-gold/60"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error */}
            {error && (
              <div className="mx-4 mb-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  disabled={sendingMessage}
                  className="flex-1 rounded-lg border border-white/10 bg-elevated px-4 py-2.5 text-sm text-soft-white placeholder:text-muted-foreground focus:border-accent-gold/30 focus:outline-none disabled:opacity-50"
                  maxLength={5000}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !messageInput.trim()}
                  className="bg-accent-gold text-background hover:bg-accent-gold/90 h-10 w-10 p-0 shrink-0"
                >
                  {sendingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-soft-white">Select a conversation</p>
            <p className="text-xs text-muted-foreground mt-1">
              Choose a conversation from the list to start messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
