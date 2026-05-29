"use client";

import React, { useState } from "react";
import { Bell, Package, DollarSign, Star, ShieldCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "order",
    title: "New Order Received",
    message: "Order #KS-008 for Handwoven Krama Scarf",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "payment",
    title: "Payment Received",
    message: "$89.00 credited to your wallet",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    type: "review",
    title: "New Review",
    message: "Sarah M. left a 5-star review on your product",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "n4",
    type: "verification",
    title: "Verification Approved",
    message: "Your seller account has been verified",
    time: "1 day ago",
    read: true,
  },
  {
    id: "n5",
    type: "message",
    title: "New Message",
    message: "David K. sent you a message about an order",
    time: "2 days ago",
    read: true,
  },
];

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  order: Package,
  payment: DollarSign,
  review: Star,
  verification: ShieldCheck,
  message: MessageSquare,
};

const typeColors: Record<string, string> = {
  order: "bg-blue-500/10 text-blue-400",
  payment: "bg-green-500/10 text-green-400",
  review: "bg-accent-gold/10 text-accent-gold",
  verification: "bg-purple-500/10 text-purple-400",
  message: "bg-sky-500/10 text-sky-400",
};

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="rounded-xl border border-white/[0.06] bg-surface">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-accent-gold" />
          <h3 className="text-sm font-semibold text-soft-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Badge className="bg-accent-gold/10 text-accent-gold border-accent-gold/30 text-[10px] px-1.5 py-0">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-soft-white"
            onClick={markAllRead}
          >
            Mark all read
          </Button>
        )}
      </div>

      <ScrollArea className="max-h-[400px]">
        <div className="divide-y divide-white/[0.03]">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type] || Bell;
            return (
              <div
                key={notification.id}
                className={cn(
                  "flex gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]",
                  !notification.read && "bg-accent-gold/[0.02]"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                    typeColors[notification.type]
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-soft-white truncate">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-gold" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {notification.message}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                    {notification.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
