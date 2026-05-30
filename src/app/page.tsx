import { Camera, MessageSquare, Handshake, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SearchBar } from "@/components/shared/search-bar";
import { CategoryCard } from "@/components/shared/category-card";
import { EmptyState } from "@/components/shared/empty-state";
import { categories } from "@/constants/categories";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const howItWorks = [
  {
    icon: Camera,
    title: "Post Your Listing",
    description:
      "Take a few photos, add a description and price, and your listing is live in minutes.",
  },
  {
    icon: MessageSquare,
    title: "Get Contacted",
    description:
      "Interested buyers will message you directly. Respond quickly for the best results.",
  },
  {
    icon: Handshake,
    title: "Make the Deal",
    description:
      "Agree on a price, meet up safely, and complete your transaction.",
  },
];

export default function Home() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <ScrollReveal>
            <h1 className="text-3xl font-bold tracking-tight text-soft-white sm:text-4xl lg:text-5xl font-playfair">
              Buy &amp; Sell Anything in Cambodia
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              The trusted marketplace for vehicles, property, electronics, jobs,
              and more.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="mt-8">
              <SearchBar />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-bold text-soft-white font-playfair">
              Browse Categories
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Find what you need across all categories
            </p>
          </ScrollReveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3">
            {categories.map((category, i) => (
              <ScrollReveal key={category.slug} delay={i * 0.05}>
                <CategoryCard category={category} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 bg-surface/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-bold text-soft-white font-playfair">
              How It Works
            </h2>
          </ScrollReveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {howItWorks.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/10">
                    <step.icon className="h-7 w-7 text-accent-gold" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-soft-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-bold text-soft-white font-playfair">
              Featured Listings
            </h2>
          </ScrollReveal>
          <div className="mt-8">
            {!supabaseReady ? (
              <EmptyState
                icon={Package}
                title="No listings yet"
                description="Be the first to post a listing on Khmer Store"
                actionLabel="Post a Listing"
                actionHref="/post"
              />
            ) : (
              <EmptyState
                icon={Package}
                title="No listings yet"
                description="Be the first to post a listing on Khmer Store"
                actionLabel="Post a Listing"
                actionHref="/post"
              />
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="rounded-xl border border-accent-gold/20 bg-surface p-8 text-center sm:p-12">
              <h2 className="text-2xl font-bold text-soft-white font-playfair">
                Ready to sell something?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Post your first listing for free and reach buyers across
                Cambodia.
              </p>
              <Button
                asChild
                className="mt-6 bg-accent-gold text-background hover:bg-accent-gold/90"
              >
                <Link href="/post">Post Your First Listing</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
