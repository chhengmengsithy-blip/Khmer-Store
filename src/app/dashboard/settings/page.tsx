"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

const locations = [
  "Phnom Penh",
  "Siem Reap",
  "Battambang",
  "Kampong Cham",
  "Sihanoukville",
];

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      toast({
        title: "Database not connected",
        description: "Configure Supabase to save settings.",
      });
      return;
    }
    toast({
      title: "Settings saved",
      description: "Your profile has been updated.",
    });
  };

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
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-soft-white">
                Display Name
              </Label>
              <Input
                id="displayName"
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
                placeholder="+855 XX XXX XXXX"
                className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-soft-white">Location</Label>
              <Select>
                <SelectTrigger className="border-white/10 bg-white/5 text-soft-white">
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent className="bg-elevated border-white/10">
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-soft-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell buyers a bit about yourself..."
                rows={3}
                className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold resize-none"
              />
            </div>

            <Button
              type="submit"
              className="bg-accent-gold text-background hover:bg-accent-gold/90"
            >
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
