"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Upload,
  User,
  Lock,
  Bell,
  Shield,
  AlertTriangle,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth-store";
import type { Profile } from "@/types";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Notification preferences (localStorage)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [listingUpdates, setListingUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Privacy preferences (localStorage)
  const [showPhone, setShowPhone] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);

  // Delete account dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Load notification preferences from localStorage
    const notifPrefs = localStorage.getItem("notification_prefs");
    if (notifPrefs) {
      const parsed = JSON.parse(notifPrefs);
      setEmailNotifications(parsed.emailNotifications ?? true);
      setMessageAlerts(parsed.messageAlerts ?? true);
      setListingUpdates(parsed.listingUpdates ?? true);
      setMarketingEmails(parsed.marketingEmails ?? false);
    }

    const privacyPrefs = localStorage.getItem("privacy_prefs");
    if (privacyPrefs) {
      const parsed = JSON.parse(privacyPrefs);
      setShowPhone(parsed.showPhone ?? true);
      setShowLocation(parsed.showLocation ?? true);
      setAllowMessages(parsed.allowMessages ?? true);
    }
  }, []);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      if (!supabase || !user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        const p = data as Profile;
        setProfile(p);
        setFullName(p.full_name || "");
        setPhone(p.phone || "");
        setLocation(p.location || "");
        setAvatarUrl(p.avatar_url || "");
      }
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase || !user) {
      toast({
        title: "Database not connected",
        description: "Configure Supabase to save settings.",
      });
      return;
    }

    setSaving(true);

    let newAvatarUrl = profile?.avatar_url || null;

    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(path);
        newAvatarUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone,
        location,
        avatar_url: newAvatarUrl,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      toast({ title: "Error", description: error.message });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same.",
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
      });
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      toast({ title: "Error", description: "Supabase not configured." });
      return;
    }

    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setChangingPassword(false);

    if (error) {
      toast({ title: "Error", description: error.message });
    } else {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem(
      "notification_prefs",
      JSON.stringify({
        emailNotifications,
        messageAlerts,
        listingUpdates,
        marketingEmails,
      })
    );
    toast({
      title: "Preferences saved",
      description: "Notification preferences updated.",
    });
  };

  const handleSavePrivacy = () => {
    localStorage.setItem(
      "privacy_prefs",
      JSON.stringify({ showPhone, showLocation, allowMessages })
    );
    toast({
      title: "Privacy settings saved",
      description: "Your privacy preferences have been updated.",
    });
  };

  const handleDeleteAccount = async () => {
    toast({
      title: "Account deletion requested",
      description:
        "Please contact support@khmerstore.com to complete account deletion.",
    });
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-accent-gold" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-soft-white font-playfair">
          Settings
        </h1>
        <p className="text-muted-foreground">Sign in to manage your settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-soft-white font-playfair">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <Card className="border-white/[0.06] bg-surface">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-gold/10">
            <User className="h-4 w-4 text-accent-gold" />
          </div>
          <CardTitle className="text-lg text-soft-white">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Avatar */}
            <div className="space-y-2">
              <Label className="text-soft-white">Profile Photo</Label>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-elevated border-2 border-white/[0.08]">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xl font-semibold">
                        {fullName?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="h-5 w-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Click the image to upload a new photo</p>
                  <p className="text-xs mt-1">JPG, PNG or WebP. Max 2MB.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-soft-white">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-soft-white">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+855 XX XXX XXXX"
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-soft-white">
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Phnom Penh, Cambodia"
                className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-soft-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others a bit about yourself..."
                rows={3}
                className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {bio.length}/200 characters
              </p>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="bg-accent-gold text-background hover:bg-accent-gold/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Section */}
      <Card className="border-white/[0.06] bg-surface">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-gold/10">
            <Lock className="h-4 w-4 text-accent-gold" />
          </div>
          <CardTitle className="text-lg text-soft-white">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-soft-white">Email Address</Label>
            <Input
              value={user.email || ""}
              disabled
              className="border-white/10 bg-white/5 text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed from here.
            </p>
          </div>

          <Separator className="bg-white/[0.06]" />

          <div>
            <h4 className="text-sm font-medium text-soft-white mb-4">
              Change Password
            </h4>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-soft-white">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-soft-white">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-soft-white">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={changingPassword || !newPassword}
                variant="outline"
                className="border-white/10"
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="border-white/[0.06] bg-surface">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-gold/10">
            <Bell className="h-4 w-4 text-accent-gold" />
          </div>
          <CardTitle className="text-lg text-soft-white">
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleItem
            label="Email Notifications"
            description="Receive important updates via email"
            checked={emailNotifications}
            onChange={setEmailNotifications}
          />
          <ToggleItem
            label="Message Alerts"
            description="Get notified when you receive new messages"
            checked={messageAlerts}
            onChange={setMessageAlerts}
          />
          <ToggleItem
            label="Listing Updates"
            description="Notifications about your listing views and favorites"
            checked={listingUpdates}
            onChange={setListingUpdates}
          />
          <ToggleItem
            label="Marketing Emails"
            description="Receive promotional offers and marketplace news"
            checked={marketingEmails}
            onChange={setMarketingEmails}
          />
          <Button
            onClick={handleSaveNotifications}
            variant="outline"
            className="border-white/10 mt-2"
          >
            Save Notification Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Section */}
      <Card className="border-white/[0.06] bg-surface">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-gold/10">
            <Shield className="h-4 w-4 text-accent-gold" />
          </div>
          <CardTitle className="text-lg text-soft-white">Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleItem
            label="Show Phone Number Publicly"
            description="Allow other users to see your phone number on listings"
            checked={showPhone}
            onChange={setShowPhone}
          />
          <ToggleItem
            label="Show Location on Listings"
            description="Display your location on your listing pages"
            checked={showLocation}
            onChange={setShowLocation}
          />
          <ToggleItem
            label="Allow Messages from Anyone"
            description="Let any user send you messages, not just buyers"
            checked={allowMessages}
            onChange={setAllowMessages}
          />
          <Button
            onClick={handleSavePrivacy}
            variant="outline"
            className="border-white/10 mt-2"
          >
            Save Privacy Settings
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/20 bg-surface">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <CardTitle className="text-lg text-red-400">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. All your
            listings, messages, and data will be permanently removed.
          </p>
          <Button
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action is permanent and cannot be undone. All your listings, messages, favorites, and profile data will be permanently deleted."
        confirmLabel="Delete My Account"
        variant="danger"
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
}

// Toggle item component
function ToggleItem({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-soft-white">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
          checked ? "bg-accent-gold" : "bg-elevated"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
