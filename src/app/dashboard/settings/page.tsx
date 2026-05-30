"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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

  const handleSave = async (e: React.FormEvent) => {
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

    // Upload avatar if changed
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
        title: "Settings saved",
        description: "Your profile has been updated.",
      });
    }
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-soft-white font-playfair">
        Settings
      </h1>

      <Card className="border-white/[0.08] bg-surface">
        <CardHeader>
          <CardTitle className="text-lg text-soft-white">
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {/* Avatar */}
            <div className="space-y-2">
              <Label className="text-soft-white">Avatar</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-elevated border border-white/[0.08]">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground text-lg font-semibold">
                      {fullName?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <label className="cursor-pointer">
                  <Button type="button" variant="outline" className="border-white/10" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-soft-white">
                Display Name
              </Label>
              <Input
                id="displayName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your display name"
                className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-soft-white">
                Phone
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

            <div className="space-y-2">
              <Label htmlFor="location" className="text-soft-white">
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Phnom Penh"
                className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
              />
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
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
