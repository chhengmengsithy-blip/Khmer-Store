import { Users, Shield, Heart } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

const values = [
  {
    icon: Shield,
    title: "Trust",
    description:
      "We build a safe environment where buyers and sellers can transact with confidence.",
  },
  {
    icon: Heart,
    title: "Simplicity",
    description:
      "Posting and finding listings should be easy, fast, and accessible to everyone.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We connect people across Cambodia, helping build local economies and relationships.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <ScrollReveal>
          <h1 className="text-3xl font-bold text-soft-white font-playfair">
            About Khmer Store
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-soft-white">
              Our Mission
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Khmer Store is Cambodia&apos;s marketplace for buying and selling.
              Our mission is to connect buyers and sellers across the country,
              making it simple for anyone to post a listing and find what they
              need - from vehicles and property to electronics, jobs, and
              services.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-soft-white">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Sellers post listings with photos, descriptions, and prices. Buyers
              browse categories, search for items, and contact sellers directly.
              Transactions happen between buyers and sellers - we provide the
              platform that makes the connection possible.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-soft-white mb-6">
              Our Values
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-lg border border-white/[0.08] bg-surface p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/10">
                    <value.icon className="h-5 w-5 text-accent-gold" />
                  </div>
                  <h3 className="mt-4 font-semibold text-soft-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
