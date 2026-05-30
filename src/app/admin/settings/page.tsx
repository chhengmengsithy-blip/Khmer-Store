"use client";

import { useState, useEffect } from "react";
import { Save, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone: string;
  commissionRate: string;
  maintenanceMode: boolean;
}

const defaultSettings: SiteSettings = {
  siteName: "Khmer Store",
  siteDescription: "A professional marketplace for buying and selling in Cambodia",
  contactEmail: "support@khmerstore.com",
  supportPhone: "+855 12 345 678",
  commissionRate: "5",
  maintenanceMode: false,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  // Admin settings are stored in localStorage only (device-local).
  // These do not have server-side enforcement; they are UI scaffolds
  // for future backend integration with a settings table.
  useEffect(() => {
    const stored = localStorage.getItem("admin-site-settings");
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch {
        // Use defaults
      }
    }
  }, []);

  function handleSave() {
    localStorage.setItem("admin-site-settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleMaintenanceMode() {
    const next = !settings.maintenanceMode;
    setSettings((prev) => ({ ...prev, maintenanceMode: next }));
    const updated = { ...settings, maintenanceMode: next };
    localStorage.setItem("admin-site-settings", JSON.stringify(updated));
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-playfair text-soft-white">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage site configuration
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-accent-gold text-background hover:bg-accent-gold/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Site Settings */}
      <Card className="border-white/[0.06] bg-surface">
        <CardHeader>
          <CardTitle className="text-soft-white text-base">
            Site Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, siteName: e.target.value }))
                }
                className="bg-elevated border-white/[0.08]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={settings.contactEmail}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    contactEmail: e.target.value,
                  }))
                }
                className="bg-elevated border-white/[0.08]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea
              id="site-description"
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  siteDescription: e.target.value,
                }))
              }
              className="bg-elevated border-white/[0.08] min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-phone">Support Phone</Label>
            <Input
              id="support-phone"
              value={settings.supportPhone}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  supportPhone: e.target.value,
                }))
              }
              className="bg-elevated border-white/[0.08] max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Commission */}
      <Card className="border-white/[0.06] bg-surface">
        <CardHeader>
          <CardTitle className="text-soft-white text-base">Commission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="commission-rate">Commission Rate (%)</Label>
            <div className="flex items-center gap-3 max-w-xs">
              <Input
                id="commission-rate"
                type="number"
                min="0"
                max="100"
                value={settings.commissionRate}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    commissionRate: e.target.value,
                  }))
                }
                className="bg-elevated border-white/[0.08]"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Platform commission on each transaction (UI placeholder only)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card className="border-white/[0.06] bg-surface">
        <CardHeader>
          <CardTitle className="text-soft-white text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            Maintenance Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-soft-white">
                Enable maintenance mode
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                When enabled, visitors will see a maintenance banner
              </p>
            </div>
            <button
              onClick={toggleMaintenanceMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? "bg-yellow-500" : "bg-elevated"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {settings.maintenanceMode && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
              <p className="text-sm text-yellow-200">
                Maintenance mode is active. Site visitors will see a
                maintenance banner.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-white/[0.06] bg-surface">
        <CardHeader>
          <CardTitle className="text-soft-white text-base flex items-center gap-2">
            <Info className="h-4 w-4 text-accent-gold" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">App Version</p>
              <Badge className="bg-accent-gold/10 text-accent-gold border-accent-gold/20">
                V4.0.0
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Environment</p>
              <p className="text-sm text-soft-white">Production</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Framework</p>
              <p className="text-sm text-soft-white">Next.js 16 (App Router)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Database</p>
              <p className="text-sm text-soft-white">Supabase (PostgreSQL)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
