import { Users, Shield, Heart, ShoppingBag, Camera, MessageSquare, Handshake } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "We build a safe environment where buyers and sellers can transact with confidence through verified accounts and moderation.",
  },
  {
    icon: Heart,
    title: "Simplicity",
    description:
      "Posting and finding listings should be easy, fast, and accessible to everyone across Cambodia.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We connect people across Cambodia, helping build local economies and meaningful relationships.",
  },
];

const steps = [
  {
    icon: Camera,
    title: "Post a Listing",
    description: "Snap photos, write a description, set your price, and publish in minutes.",
  },
  {
    icon: MessageSquare,
    title: "Connect with Buyers",
    description: "Interested buyers message you directly through our built-in messaging system.",
  },
  {
    icon: Handshake,
    title: "Close the Deal",
    description: "Agree on terms, meet up safely, and complete your transaction.",
  },
];

const stats = [
  { value: "9", label: "Categories" },
  { value: "24/7", label: "Available" },
  { value: "Free", label: "To List" },
  { value: "100%", label: "Local" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        {/* Hero */}
        <ScrollReveal>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10">
              <ShoppingBag className="h-8 w-8 text-accent-gold" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-soft-white font-playfair sm:text-4xl">
              About Khmer Store
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
              Cambodia&apos;s trusted online marketplace connecting buyers and sellers
              across the country since day one.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.1}>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-white/[0.08] bg-surface text-center">
                <CardContent className="p-6">
                  <p className="text-2xl font-bold text-accent-gold">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>

        {/* Mission */}
        <ScrollReveal delay={0.15}>
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-soft-white">Our Mission</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Khmer Store exists to make buying and selling accessible to everyone in Cambodia.
              Whether you are looking for a vehicle, renting property, hiring talent, or selling
              electronics, our platform provides a simple, safe, and free way to connect with
              your local community.
            </p>
          </section>
        </ScrollReveal>

        {/* How It Works */}
        <ScrollReveal delay={0.2}>
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-soft-white mb-6">How It Works</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {steps.map((step, i) => (
                <div key={step.title} className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-gold/10">
                    <step.icon className="h-6 w-6 text-accent-gold" />
                  </div>
                  <span className="mt-2 text-xs font-medium text-accent-gold">Step {i + 1}</span>
                  <h3 className="mt-2 font-semibold text-soft-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Values */}
        <ScrollReveal delay={0.3}>
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-soft-white mb-6">Our Values</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {values.map((value) => (
                <Card key={value.title} className="border-white/[0.08] bg-surface">
                  <CardContent className="p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/10">
                      <value.icon className="h-5 w-5 text-accent-gold" />
                    </div>
                    <h3 className="mt-4 font-semibold text-soft-white">{value.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
