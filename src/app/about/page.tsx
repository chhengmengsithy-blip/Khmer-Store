import type { Metadata } from "next";
import {
  Users,
  Shield,
  Heart,
  ShoppingBag,
  Camera,
  MessageSquare,
  Handshake,
  Lightbulb,
  Target,
  Eye,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | Khmer Store",
  description:
    "Learn about Khmer Store, Cambodia's premier online marketplace connecting buyers and sellers across the country.",
};

const values = [
  {
    icon: Shield,
    title: "Trust",
    description:
      "We build a safe environment where buyers and sellers can transact with confidence through verified accounts and active moderation.",
    color: "blue",
  },
  {
    icon: Heart,
    title: "Safety",
    description:
      "User safety is paramount. We provide tools, guidelines, and a dedicated team to ensure every transaction is secure.",
    color: "emerald",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We connect people across Cambodia, fostering local economies and building meaningful relationships through commerce.",
    color: "purple",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We continuously improve our platform with modern technology to deliver the best marketplace experience possible.",
    color: "amber",
  },
];

const valueColors = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "hover:border-blue-500/30",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "hover:border-emerald-500/30",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "hover:border-purple-500/30",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "hover:border-amber-500/30",
  },
};

const steps = [
  {
    icon: Camera,
    title: "Post a Listing",
    description:
      "Snap photos, write a description, set your price, and publish in minutes.",
  },
  {
    icon: MessageSquare,
    title: "Connect with Buyers",
    description:
      "Interested buyers message you directly through our built-in messaging system.",
  },
  {
    icon: Handshake,
    title: "Close the Deal",
    description:
      "Agree on terms, meet up safely, and complete your transaction.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        {/* Hero */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10">
              <ShoppingBag className="h-8 w-8 text-accent-gold" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-soft-white font-playfair sm:text-4xl lg:text-5xl">
              About Khmer Store
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Cambodia&apos;s trusted online marketplace connecting buyers and
              sellers across the country. We make buying and selling accessible,
              safe, and simple for everyone.
            </p>
          </div>
        </ScrollReveal>

        {/* Mission & Vision */}
        <ScrollReveal delay={0.15}>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <Card className="border-white/[0.06] bg-surface relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400" />
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Target className="h-5 w-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-soft-white">
                    Our Mission
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To make buying and selling accessible to everyone in Cambodia.
                  Whether you are looking for a vehicle, renting property, hiring
                  talent, or selling electronics, our platform provides a simple,
                  safe, and free way to connect with your local community.
                </p>
              </CardContent>
            </Card>
            <Card className="border-white/[0.06] bg-surface relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400" />
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <Eye className="h-5 w-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-soft-white">
                    Our Vision
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading digital marketplace in Southeast Asia,
                  empowering millions of people to build livelihoods, find great
                  deals, and create thriving local economies through trusted
                  peer-to-peer commerce.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* How It Works */}
        <ScrollReveal delay={0.2}>
          <section className="mt-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-soft-white font-playfair">
                How It Works
              </h2>
              <p className="mt-2 text-muted-foreground">
                Getting started is easy. Follow these three simple steps.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="relative flex flex-col items-center text-center"
                >
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] border-t border-dashed border-white/[0.08]" />
                  )}
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold/10 ring-4 ring-background">
                    <step.icon className="h-6 w-6 text-accent-gold" />
                  </div>
                  <span className="mt-3 inline-flex items-center rounded-full bg-accent-gold/10 px-3 py-0.5 text-xs font-medium text-accent-gold">
                    Step {i + 1}
                  </span>
                  <h3 className="mt-3 font-semibold text-soft-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Values */}
        <ScrollReveal delay={0.3}>
          <section className="mt-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-soft-white font-playfair">
                Our Values
              </h2>
              <p className="mt-2 text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => {
                const colors = valueColors[value.color as keyof typeof valueColors];
                return (
                  <Card
                    key={value.title}
                    className={`border-white/[0.06] bg-surface ${colors.border} transition-colors`}
                  >
                    <CardContent className="p-6">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
                        <value.icon className={`h-5 w-5 ${colors.text}`} />
                      </div>
                      <h3 className="mt-4 font-semibold text-soft-white">
                        {value.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
