"use client";

import { Mail, MapPin, Phone, Globe, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We will get back to you as soon as possible.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-soft-white font-playfair">
          Contact Us
        </h1>
        <p className="mt-2 text-muted-foreground">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <Card className="border-white/[0.08] bg-surface">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-soft-white">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                    className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-soft-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-soft-white">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="What is this about?"
                    required
                    className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-soft-white">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={5}
                    required
                    className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-accent-gold text-background hover:bg-accent-gold/90"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/10">
                <Mail className="h-5 w-5 text-accent-gold" />
              </div>
              <div>
                <h3 className="font-medium text-soft-white">Email</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  support@khmerstore.com
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/10">
                <Phone className="h-5 w-5 text-accent-gold" />
              </div>
              <div>
                <h3 className="font-medium text-soft-white">Phone</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  +855 12 345 678
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/10">
                <MapPin className="h-5 w-5 text-accent-gold" />
              </div>
              <div>
                <h3 className="font-medium text-soft-white">Location</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Phnom Penh, Cambodia
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 border-t border-white/[0.08]">
              <h3 className="font-medium text-soft-white mb-4">Follow Us</h3>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-accent-gold/10 hover:text-accent-gold"
                  aria-label="Website"
                >
                  <Globe className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-muted-foreground transition-colors hover:bg-accent-gold/10 hover:text-accent-gold"
                  aria-label="Telegram"
                >
                  <Send className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
