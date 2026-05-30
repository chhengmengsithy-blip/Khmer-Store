"use client";

import { useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "support@khmerstore.com",
    description: "We respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+855 12 345 678",
    description: "Mon-Fri, 9am-6pm ICT",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "Phnom Penh, Cambodia",
    description: "BKK1, Street 240",
  },
  {
    icon: Clock,
    title: "Hours",
    value: "Mon - Fri, 9AM - 6PM",
    description: "Cambodia Time (ICT)",
  },
];

const faqs = [
  {
    question: "How do I post a listing?",
    answer:
      "Simply sign in to your account, click the 'Sell Now' button in the header, and follow the step-by-step form to add your item details, photos, and price.",
  },
  {
    question: "Is it free to use Khmer Store?",
    answer:
      "Yes! Posting listings and browsing the marketplace is completely free. We do not charge any fees for transactions between buyers and sellers.",
  },
  {
    question: "How do I contact a seller?",
    answer:
      "On any listing page, click the 'Message Seller' button to send a direct message. You can also reveal the seller's phone number if they have made it public.",
  },
  {
    question: "How do I report a suspicious listing?",
    answer:
      "Click the 'Report' button on any listing page. Select a reason and provide details. Our moderation team reviews all reports within 24 hours.",
  },
  {
    question: "Can I edit or delete my listing after posting?",
    answer:
      "Yes, go to your Dashboard to manage all your listings. You can edit details, change the status, or delete listings at any time.",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {};
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!subject || subject.trim().length < 3) {
      errors.subject = "Subject must be at least 3 characters";
    }
    if (!message || message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Contact form - UI scaffold with client-side validation only.
  // Shows a success toast but does not transmit data to a backend.
  // Wire to an API route or email service for production use.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) return;

    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. We will get back to you within 24 hours.",
    });
    (e.target as HTMLFormElement).reset();
    setFormErrors({});
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        {/* Hero */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl font-bold text-soft-white font-playfair sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-3 text-muted-foreground">
              Have a question, feedback, or need help? We are here for you.
              Reach out and our team will respond as quickly as possible.
            </p>
          </div>
        </ScrollReveal>

        {/* Contact Info Cards */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-12">
            {contactInfo.map((info) => (
              <Card
                key={info.title}
                className="border-white/[0.06] bg-surface hover:border-accent-gold/20 transition-colors"
              >
                <CardContent className="p-5 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-accent-gold/10">
                    <info.icon className="h-5 w-5 text-accent-gold" />
                  </div>
                  <h3 className="mt-3 text-sm font-medium text-soft-white">
                    {info.title}
                  </h3>
                  <p className="mt-1 text-sm text-accent-gold">{info.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact Form */}
          <ScrollReveal delay={0.15} className="lg:col-span-3">
            <Card className="border-white/[0.06] bg-surface">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-soft-white mb-6">
                  Send us a message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-soft-white">
                        Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-400">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-soft-white">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-400">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-soft-white">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is this about?"
                      className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold"
                    />
                    {formErrors.subject && (
                      <p className="text-xs text-red-400">
                        {formErrors.subject}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-soft-white">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you?"
                      rows={5}
                      className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold resize-none"
                    />
                    {formErrors.message && (
                      <p className="text-xs text-red-400">
                        {formErrors.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-accent-gold text-background hover:bg-accent-gold/90"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Map Placeholder + Hours */}
          <ScrollReveal delay={0.2} className="lg:col-span-2">
            <div className="space-y-6">
              {/* Map Placeholder */}
              <Card className="border-white/[0.06] bg-surface overflow-hidden">
                <div className="relative h-48 bg-elevated flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-accent-gold mx-auto" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Phnom Penh, Cambodia
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      BKK1, Street 240
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/50 to-transparent pointer-events-none" />
                </div>
              </Card>

              {/* Business Hours */}
              <Card className="border-white/[0.06] bg-surface">
                <CardContent className="p-5">
                  <h3 className="font-medium text-soft-white mb-3">
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mon - Fri</span>
                      <span className="text-soft-white">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="text-soft-white">9:00 AM - 12:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="text-muted-foreground/60">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>

        {/* FAQ Section */}
        <ScrollReveal delay={0.25}>
          <section className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-soft-white font-playfair">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-white/[0.06] bg-surface overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(openFaq === index ? null : index)
                    }
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <span className="text-sm font-medium text-soft-white pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
