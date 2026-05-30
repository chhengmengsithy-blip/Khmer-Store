"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Loader2, Camera, Shield, Bell } from "lucide-react";
import { FadeIn } from "@/components/animations/motion-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  updateProfile,
  updatePassword,
  updateAvatar,
} from "@/features/dashboard/actions/settings-actions";
import { createClient } from "@/lib/supabase/client";

const NOTIFICATION_STORAGE_KEY = "khmer-store-notification-prefs";

interface NotificationPrefs {
  order_updates: boolean;
  new_messages: boolean;
  payment_received: boolean;
  new_reviews: boolean;
  promotions: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  order_updates: true,
  new_messages: true,
  payment_received: true,
  new_reviews: true,
  promotions: true,
};

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

  // Avatar state
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(avatarUrl);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [twoFAError, setTwoFAError] = useState<string | null>(null);
  const [twoFASuccess, setTwoFASuccess] = useState<string | null>(null);
  const [twoFALoading, setTwoFALoading] = useState(false);

  // Notification preferences state (lazy init from localStorage)
  const [notifPrefs, setNotifPrefs] = useState<NotificationPrefs>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFS;
    try {
      const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as NotificationPrefs;
      }
    } catch {
      // Use defaults if parsing fails
    }
    return DEFAULT_PREFS;
  });
  const [notifSuccess, setNotifSuccess] = useState<string | null>(null);

  // Check 2FA status on mount
  useEffect(() => {
    const check2FAStatus = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.mfa.listFactors();
      if (data && data.totp && data.totp.length > 0) {
        const verifiedFactor = data.totp.find(
          (f) => f.status === "verified"
        );
        if (verifiedFactor) {
          setTwoFactorEnabled(true);
          setFactorId(verifiedFactor.id);
        }
      }
    };
    check2FAStatus();
  }, []);

  // Derive initials for avatar fallback
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("File size must be less than 2MB.");
      return;
    }

    setAvatarLoading(true);
    setAvatarError(null);

    try {
      const supabase = createClient();

      // Get current user id for the file path
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setAvatarError("Not authenticated.");
        setAvatarLoading(false);
        return;
      }

      const ext = file.name.split(".").pop() || "png";
      const fileName = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) {
        setAvatarError(uploadError.message);
        setAvatarLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      // Save avatar URL to profile via server action
      const result = await updateAvatar(publicUrl);
      if (result.error) {
        setAvatarError(result.error);
      } else {
        setCurrentAvatarUrl(publicUrl);
      }
    } catch {
      setAvatarError("Failed to upload avatar.");
    } finally {
      setAvatarLoading(false);
      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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

  // 2FA handlers
  const handleEnable2FA = async () => {
    setTwoFALoading(true);
    setTwoFAError(null);
    setTwoFASuccess(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Khmer Store",
      });

      if (error) {
        setTwoFAError(error.message);
        setTwoFALoading(false);
        return;
      }

      if (data) {
        setFactorId(data.id);
        setQrCode(data.totp.qr_code);
        setEnrolling(true);
      }
    } catch {
      setTwoFAError("Failed to start 2FA enrollment.");
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!factorId || !verifyCode) return;

    setTwoFALoading(true);
    setTwoFAError(null);

    try {
      const supabase = createClient();
      const { data: challengeData, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });

      if (challengeError) {
        setTwoFAError(challengeError.message);
        setTwoFALoading(false);
        return;
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode,
      });

      if (verifyError) {
        setTwoFAError(verifyError.message);
        setTwoFALoading(false);
        return;
      }

      setTwoFactorEnabled(true);
      setEnrolling(false);
      setQrCode(null);
      setVerifyCode("");
      setTwoFASuccess("Two-factor authentication enabled successfully!");
    } catch {
      setTwoFAError("Failed to verify 2FA code.");
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!factorId) return;

    setTwoFALoading(true);
    setTwoFAError(null);
    setTwoFASuccess(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.mfa.unenroll({ factorId });

      if (error) {
        setTwoFAError(error.message);
        setTwoFALoading(false);
        return;
      }

      setTwoFactorEnabled(false);
      setFactorId(null);
      setTwoFASuccess("Two-factor authentication has been disabled.");
    } catch {
      setTwoFAError("Failed to disable 2FA.");
    } finally {
      setTwoFALoading(false);
    }
  };

  // Notification handlers
  const handleNotifChange = useCallback(
    (key: keyof NotificationPrefs) => {
      setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    []
  );

  const handleSaveNotifications = () => {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifPrefs));
    setNotifSuccess("Notification preferences saved!");
    setTimeout(() => setNotifSuccess(null), 3000);
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

            {/* Avatar Error */}
            {avatarError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {avatarError}
              </div>
            )}

            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  {currentAvatarUrl && (
                    <AvatarImage src={currentAvatarUrl} alt="Profile photo" />
                  )}
                  <AvatarFallback className="bg-accent-gold/10 text-accent-gold text-xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-gold text-background"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                >
                  {avatarLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Camera className="h-3 w-3" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
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

            {/* Success Banner */}
            {notifSuccess && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                {notifSuccess}
              </div>
            )}

            <div className="space-y-3">
              {(
                [
                  {
                    key: "order_updates" as const,
                    label: "Order updates",
                    description: "Get notified when order status changes",
                  },
                  {
                    key: "new_messages" as const,
                    label: "New messages",
                    description: "Receive notifications for new messages",
                  },
                  {
                    key: "payment_received" as const,
                    label: "Payment received",
                    description: "Get notified when payments are credited",
                  },
                  {
                    key: "new_reviews" as const,
                    label: "New reviews",
                    description: "Be informed of new product reviews",
                  },
                  {
                    key: "promotions" as const,
                    label: "Promotions",
                    description:
                      "Receive marketing and promotional emails",
                  },
                ] as const
              ).map((pref) => (
                <label
                  key={pref.key}
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
                    checked={notifPrefs[pref.key]}
                    onChange={() => handleNotifChange(pref.key)}
                    className="h-4 w-4 rounded border-white/20 bg-elevated accent-amber-500"
                  />
                </label>
              ))}
            </div>
            <Button
              className="bg-accent-gold text-background hover:bg-accent-gold/90"
              onClick={handleSaveNotifications}
            >
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

              {/* 2FA Error */}
              {twoFAError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {twoFAError}
                </div>
              )}

              {/* 2FA Success */}
              {twoFASuccess && (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  {twoFASuccess}
                </div>
              )}

              {/* 2FA Enrollment Flow */}
              {enrolling && qrCode && (
                <div className="space-y-4 rounded-lg border border-white/[0.06] p-4">
                  <p className="text-sm text-soft-white">
                    Scan this QR code with your authenticator app:
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCode}
                    alt="2FA QR Code"
                    className="mx-auto h-48 w-48 rounded-lg"
                  />
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Verification Code
                    </Label>
                    <Input
                      className="bg-elevated border-white/10"
                      placeholder="Enter 6-digit code"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      maxLength={6}
                      disabled={twoFALoading}
                    />
                  </div>
                  <Button
                    className="bg-accent-gold text-background hover:bg-accent-gold/90"
                    onClick={handleVerify2FA}
                    disabled={twoFALoading || verifyCode.length < 6}
                  >
                    {twoFALoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Verify and Enable
                  </Button>
                </div>
              )}

              {/* Enable/Disable buttons */}
              {!enrolling && !twoFactorEnabled && (
                <Button
                  variant="outline"
                  className="border-accent-gold/30 text-accent-gold hover:bg-accent-gold/10"
                  onClick={handleEnable2FA}
                  disabled={twoFALoading}
                >
                  {twoFALoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Enable 2FA
                </Button>
              )}

              {twoFactorEnabled && (
                <div className="space-y-2">
                  <p className="text-sm text-green-400">
                    Two-factor authentication is enabled.
                  </p>
                  <Button
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={handleDisable2FA}
                    disabled={twoFALoading}
                  >
                    {twoFALoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Disable 2FA
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </FadeIn>
  );
}
