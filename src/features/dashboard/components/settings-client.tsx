"use client";

import React, { useState } from "react";
import { Loader2, Camera, Shield, Bell } from "lucide-react";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  updateProfile,
  updatePassword,
} from "@/features/dashboard/actions/settings-actions";

interface SettingsClientProps {
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  country: string;
  bio: string;
  avatarUrl: string;
}

export function SettingsClient({
  fullName: initialFullName,
  displayName: initialDisplayName,
  email,
  phone: initialPhone,
  country: initialCountry,
  bio: initialBio,
  avatarUrl,
}: SettingsClientProps) {
  // Profile form state
  const [fullName, setFullName] = useState(initialFullName);
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [phone, setPhone] = useState(initialPhone);
  const [country, setCountry] = useState(initialCountry);
  const [bio, setBio] = useState(initialBio);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Derive initials for avatar fallback
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // avatarUrl reserved for future avatar image display
  void avatarUrl;

  const handleSaveProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);

    const formData = new FormData();
    formData.set("full_name", fullName);
    formData.set("display_name", displayName);
    formData.set("phone", phone);
    formData.set("country", country);
    formData.set("bio", bio);

    const result = await updateProfile(formData);

    setProfileLoading(false);

    if (result.error) {
      setProfileError(result.error);
    } else {
      setProfileSuccess("Profile updated successfully!");
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      setPasswordLoading(false);
      return;
    }

    const formData = new FormData();
    formData.set("currentPassword", currentPassword);
    formData.set("newPassword", newPassword);
    formData.set("confirmPassword", confirmPassword);

    const result = await updatePassword(formData);

    setPasswordLoading(false);

    if (result.error) {
      setPasswordError(result.error);
    } else {
      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

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
            {/* Error Banner */}
            {profileError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {profileError}
              </div>
            )}

            {/* Success Banner */}
            {profileSuccess && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                {profileSuccess}
              </div>
            )}

            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-accent-gold/10 text-accent-gold text-xl font-semibold">
                    {initials}
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={profileLoading}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-soft-white">Display Name</Label>
                <Input
                  className="bg-elevated border-white/10"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={profileLoading}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-soft-white">Email</Label>
                <Input
                  className="bg-elevated border-white/10"
                  value={email}
                  type="email"
                  disabled
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label className="text-soft-white">Phone</Label>
                <Input
                  className="bg-elevated border-white/10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={profileLoading}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-soft-white">Country</Label>
                <Input
                  className="bg-elevated border-white/10"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={profileLoading}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-soft-white">Bio</Label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border border-white/10 bg-elevated px-3 py-2 text-sm text-soft-white placeholder:text-muted-foreground focus:border-accent-gold/30 focus:outline-none resize-none"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={profileLoading}
                />
              </div>
            </div>

            <Button
              className="bg-accent-gold text-background hover:bg-accent-gold/90"
              onClick={handleSaveProfile}
              disabled={profileLoading}
            >
              {profileLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
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
                {
                  label: "Order updates",
                  description: "Get notified when order status changes",
                },
                {
                  label: "New messages",
                  description: "Receive notifications for new messages",
                },
                {
                  label: "Payment received",
                  description: "Get notified when payments are credited",
                },
                {
                  label: "New reviews",
                  description: "Be informed of new product reviews",
                },
                {
                  label: "Promotions",
                  description: "Receive marketing and promotional emails",
                },
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

            {/* Error Banner */}
            {passwordError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {passwordError}
              </div>
            )}

            {/* Success Banner */}
            {passwordSuccess && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                {passwordSuccess}
              </div>
            )}

            {/* Change Password */}
            <div className="space-y-4">
              <h4 className="text-sm text-soft-white">Change Password</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-muted-foreground">
                    Current Password
                  </Label>
                  <Input
                    type="password"
                    className="bg-elevated border-white/10"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={passwordLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">New Password</Label>
                  <Input
                    type="password"
                    className="bg-elevated border-white/10"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={passwordLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    Confirm New Password
                  </Label>
                  <Input
                    type="password"
                    className="bg-elevated border-white/10"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={passwordLoading}
                  />
                </div>
              </div>
              <Button
                className="bg-accent-gold text-background hover:bg-accent-gold/90"
                onClick={handleUpdatePassword}
                disabled={passwordLoading}
              >
                {passwordLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
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
