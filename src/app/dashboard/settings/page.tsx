"use client";

import React from "react";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Shield, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <FadeIn className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-soft-white">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-surface border border-white/[0.06]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <div className="rounded-xl border border-white/[0.06] bg-surface p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-accent-gold/10 text-accent-gold text-xl font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-gold text-background">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-soft-white">
                  Profile Photo
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            <Separator className="bg-white/5" />

            {/* Form Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-soft-white">Full Name</Label>
                <Input
                  className="bg-elevated border-white/10"
                  defaultValue="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-soft-white">Email</Label>
                <Input
                  className="bg-elevated border-white/10"
                  defaultValue="john@example.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-soft-white">Phone</Label>
                <Input
                  className="bg-elevated border-white/10"
                  defaultValue="+855 12 345 678"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-soft-white">Country</Label>
                <Input
                  className="bg-elevated border-white/10"
                  defaultValue="Cambodia"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-soft-white">Bio</Label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-white/10 bg-elevated px-3 py-2 text-sm text-soft-white placeholder:text-muted-foreground focus:border-accent-gold/30 focus:outline-none resize-none"
                  defaultValue="Passionate about authentic Cambodian craftsmanship."
                />
              </div>
            </div>

            <Button className="bg-accent-gold text-background hover:bg-accent-gold/90">
              Save Changes
            </Button>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6">
          <div className="rounded-xl border border-white/[0.06] bg-surface p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent-gold" />
              <h3 className="text-sm font-semibold text-soft-white">
                Notification Preferences
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Order updates", description: "Get notified when order status changes" },
                { label: "New messages", description: "Receive notifications for new messages" },
                { label: "Payment received", description: "Get notified when payments are credited" },
                { label: "New reviews", description: "Be informed of new product reviews" },
                { label: "Promotions", description: "Receive marketing and promotional emails" },
              ].map((pref) => (
                <label
                  key={pref.label}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] p-3 cursor-pointer hover:border-white/20 transition-colors"
                >
                  <div>
                    <p className="text-sm text-soft-white">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {pref.description}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-white/20 bg-elevated accent-amber-500"
                  />
                </label>
              ))}
            </div>
            <Button className="bg-accent-gold text-background hover:bg-accent-gold/90">
              Save Preferences
            </Button>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6">
          <div className="rounded-xl border border-white/[0.06] bg-surface p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent-gold" />
              <h3 className="text-sm font-semibold text-soft-white">
                Security Settings
              </h3>
            </div>

            {/* Change Password */}
            <div className="space-y-4">
              <h4 className="text-sm text-soft-white">Change Password</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-muted-foreground">Current Password</Label>
                  <Input
                    type="password"
                    className="bg-elevated border-white/10"
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">New Password</Label>
                  <Input
                    type="password"
                    className="bg-elevated border-white/10"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Confirm New Password</Label>
                  <Input
                    type="password"
                    className="bg-elevated border-white/10"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <Button className="bg-accent-gold text-background hover:bg-accent-gold/90">
                Update Password
              </Button>
            </div>

            <Separator className="bg-white/5" />

            {/* Two-Factor */}
            <div className="space-y-3">
              <h4 className="text-sm text-soft-white">
                Two-Factor Authentication
              </h4>
              <p className="text-xs text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
              <Button
                variant="outline"
                className="border-accent-gold/30 text-accent-gold hover:bg-accent-gold/10"
              >
                Enable 2FA
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </FadeIn>
  );
}
