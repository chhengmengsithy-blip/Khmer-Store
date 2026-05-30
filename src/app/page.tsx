import {
  Camera,
  MessageSquare,
  Handshake,
  Package,
  Users,
  ShoppingBag,
  Shield,
  Star,
  Download,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { SearchBar } from "@/components/shared/search-bar";
import { CategoryCard } from "@/components/shared/category-card";
import { ListingCard } from "@/components/shared/listing-card";
import { EmptyState } from "@/components/shared/empty-state";
import { categories } from "@/constants/categories";
import { getListings } from "@/features/listings/actions/listing-actions";

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

const testimonials = [
  {
    name: "Sokha Chan",
    role: "Seller",
    quote:
      "I sold my motorbike within 2 days of posting. The process was incredibly smooth and I got a great price.",
    avatar: "SC",
  },
  {
    name: "Pheakdey Lim",
    role: "Buyer",
    quote:
      "Found an amazing apartment at a fraction of what I expected. Khmer Store made it easy to connect with the landlord.",
    avatar: "PL",
  },
  {
    name: "Channary Vong",
    role: "Business Owner",
    quote:
      "My electronics shop gets consistent leads from the platform. It has become an essential part of my business.",
    avatar: "CV",
  },
];

export default async function Home() {
  const { data: listings } = await getListings({ limit: 8 });

  return (
    <div className="flex min-h-screen flex-col">
      {/* Section 1: Hero */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-background to-blue-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,167,105,0.05)_0%,transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <ScrollReveal>
            <h1 className="text-3xl font-bold tracking-tight text-soft-white sm:text-4xl lg:text-5xl xl:text-6xl font-playfair">
              Buy &amp; Sell Anything in{" "}
              <span className="text-accent-gold">Cambodia</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              The trusted marketplace for vehicles, property, electronics, jobs,
              and more. Join thousands of buyers and sellers across the country.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <div className="mt-8">
              <SearchBar />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-accent-gold" />
                Verified Sellers
              </span>
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4 text-accent-gold" />
                Free to Post
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 2: Popular Categories */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-bold text-soft-white font-playfair sm:text-3xl">
              Popular Categories
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

      {/* Section 3: Featured/Recent Listings */}
      <section className="py-12 sm:py-16 bg-surface/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-soft-white font-playfair sm:text-3xl">
                  Featured Listings
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recently posted items from our community
                </p>
              </div>
              <Button
                variant="ghost"
                asChild
                className="hidden sm:flex text-accent-gold hover:text-accent-gold/80"
              >
                <Link href="/marketplace">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
          <div className="mt-8">
            {listings && listings.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {listings.map((listing, i) => (
                  <ScrollReveal key={listing.id} delay={i * 0.05}>
                    <ListingCard listing={listing} />
                  </ScrollReveal>
                ))}
              </div>
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
          <div className="mt-6 text-center sm:hidden">
            <Button
              variant="outline"
              asChild
              className="border-white/10 text-soft-white hover:bg-elevated"
            >
              <Link href="/marketplace">
                View All Listings
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-bold text-soft-white font-playfair sm:text-3xl">
              How It Works
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Start buying or selling in three simple steps
            </p>
          </ScrollReveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {howItWorks.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.1}>
                <div className="relative flex flex-col items-center text-center">
                  {/* Step number */}
                  <span className="absolute -top-2 right-1/2 translate-x-8 text-5xl font-bold text-white/[0.03] font-mono">
                    {i + 1}
                  </span>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10 ring-1 ring-accent-gold/20">
                    <step.icon className="h-7 w-7 text-accent-gold" />
                  </div>
                  {/* Connecting line (only between items on desktop) */}
                  {i < howItWorks.length - 1 && (
                    <div className="absolute left-[calc(50%+3rem)] top-8 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-accent-gold/20 to-transparent sm:block" />
                  )}
                  <h3 className="mt-5 text-base font-semibold text-soft-white">
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

      {/* Section 5: Trust / Stats */}
      <section className="py-12 sm:py-16 bg-surface/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-bold text-soft-white font-playfair sm:text-3xl">
              Trusted by Thousands
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Growing every day across Cambodia
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div className="rounded-lg border border-white/[0.06] bg-surface p-6 text-center">
                <ShoppingBag className="mx-auto h-6 w-6 text-accent-gold" />
                <p className="mt-3 text-2xl font-bold text-accent-gold sm:text-3xl font-mono">
                  1,000+
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Listings</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-surface p-6 text-center">
                <Users className="mx-auto h-6 w-6 text-accent-gold" />
                <p className="mt-3 text-2xl font-bold text-accent-gold sm:text-3xl font-mono">
                  500+
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Users</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-surface p-6 text-center">
                <Shield className="mx-auto h-6 w-6 text-accent-gold" />
                <p className="mt-3 text-2xl font-bold text-accent-gold sm:text-3xl font-mono">
                  9
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Categories</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-surface p-6 text-center">
                <Star className="mx-auto h-6 w-6 text-accent-gold" />
                <p className="mt-3 text-2xl font-bold text-accent-gold sm:text-3xl font-mono">
                  24/7
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 6: Testimonials */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-bold text-soft-white font-playfair sm:text-3xl">
              What Our Users Say
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Real stories from our community
            </p>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <ScrollReveal key={testimonial.name} delay={i * 0.1}>
                <div className="rounded-lg border border-white/[0.06] bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold/20 text-sm font-semibold text-accent-gold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-soft-white">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-3.5 w-3.5 fill-accent-gold text-accent-gold"
                      />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Download App CTA */}
      <section className="py-12 sm:py-16 bg-surface/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center gap-8 rounded-xl border border-white/[0.06] bg-surface p-8 sm:flex-row sm:p-12">
              {/* Phone Mockup Placeholder */}
              <div className="flex h-48 w-32 items-center justify-center rounded-2xl border border-white/[0.08] bg-elevated sm:h-56 sm:w-36">
                <Download className="h-10 w-10 text-accent-gold" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-soft-white font-playfair">
                  Get the App
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Download Khmer Store on your mobile device for the best
                  experience. Browse listings, chat with sellers, and get
                  notifications on the go.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-elevated px-4 text-xs text-muted-foreground">
                    App Store - Coming Soon
                  </div>
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-elevated px-4 text-xs text-muted-foreground">
                    Play Store - Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 8: Newsletter */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-soft-white font-playfair">
                Stay in the Loop
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Get notified about new listings and marketplace updates.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="sm:w-80 border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60"
                />
                <Button className="bg-accent-gold text-background hover:bg-accent-gold/90">
                  Subscribe
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
