"use client";

import {
  Camera,
  MessageSquare,
  Handshake,
  Package,
  ShoppingBag,
  Shield,
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
import { useTranslation } from "@/hooks/use-translation";

interface HomeContentProps {
  listings: any[] | null;
}

const stepColors = {
  blue: {
    bg: "bg-blue-500/10",
    ring: "ring-blue-500/20",
    text: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-400",
    line: "from-blue-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    ring: "ring-purple-500/20",
    text: "text-purple-400",
    badge: "bg-purple-500/10 text-purple-400",
    line: "from-purple-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400",
    line: "from-emerald-500/20",
  },
};

export function HomeContent({ listings }: HomeContentProps) {
  const { t } = useTranslation();

  const howItWorks = [
    {
      icon: Camera,
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
      color: "blue",
    },
    {
      icon: MessageSquare,
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
      color: "purple",
    },
    {
      icon: Handshake,
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
      color: "emerald",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Section 1: Hero */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-blue-950/20 to-teal-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,167,105,0.04)_0%,transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <ScrollReveal>
            <h1 className="text-3xl font-bold tracking-tight text-soft-white sm:text-4xl lg:text-5xl xl:text-6xl font-playfair">
              {t.hero.title}{" "}
              <span className="text-accent-gold">{t.hero.titleHighlight}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t.hero.description}
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
                {t.hero.verifiedSellers}
              </span>
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4 text-accent-gold" />
                {t.hero.freeToPost}
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 2: Popular Categories */}
      <section className="relative py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.03)_0%,transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-bold text-soft-white font-playfair sm:text-3xl">
              {t.sections.popularCategories}
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {t.sections.popularCategoriesDesc}
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
                  {t.sections.featuredListings}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t.sections.featuredListingsDesc}
                </p>
              </div>
              <Button
                variant="ghost"
                asChild
                className="hidden sm:flex text-accent-gold hover:text-accent-gold/80"
              >
                <Link href="/marketplace">
                  {t.common.viewAll}
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
                title={t.common.noListingsYet}
                description={t.common.beFirstToPost}
                actionLabel={t.common.postListing}
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
                {t.common.viewAllListings}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section id="how-it-works" className="relative py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.03)_0%,transparent_50%)]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-bold text-soft-white font-playfair sm:text-3xl">
              {t.sections.howItWorks}
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {t.sections.howItWorksDesc}
            </p>
          </ScrollReveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {howItWorks.map((step, i) => {
              const colors = stepColors[step.color as keyof typeof stepColors];
              return (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="relative flex flex-col items-center text-center">
                    <span className="absolute -top-2 right-1/2 translate-x-8 text-5xl font-bold text-white/[0.03] font-mono">
                      {i + 1}
                    </span>
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full ${colors.bg} ring-1 ${colors.ring}`}>
                      <step.icon className={`h-7 w-7 ${colors.text}`} />
                    </div>
                    {i < howItWorks.length - 1 && (
                      <div className={`absolute left-[calc(50%+3rem)] top-8 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r ${colors.line} to-transparent sm:block`} />
                    )}
                    <span className={`mt-5 inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${colors.badge}`}>
                      Step {i + 1}
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-soft-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 5: Platform Facts */}
      <section className="py-12 sm:py-16 bg-surface/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-bold text-soft-white font-playfair sm:text-3xl">
              {t.sections.ourPlatform}
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {t.sections.ourPlatformDesc}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-lg mx-auto">
              <div className="rounded-lg border border-purple-500/20 bg-surface p-6 text-center transition-all hover:border-purple-500/40">
                <Shield className="mx-auto h-6 w-6 text-purple-400" />
                <p className="mt-3 text-2xl font-bold text-purple-400 sm:text-3xl font-mono">
                  9
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{t.stats.categories}</p>
              </div>
              <div className="rounded-lg border border-teal-500/20 bg-surface p-6 text-center transition-all hover:border-teal-500/40">
                <ShoppingBag className="mx-auto h-6 w-6 text-teal-400" />
                <p className="mt-3 text-2xl font-bold text-teal-400 sm:text-3xl font-mono">
                  24/7
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{t.stats.available}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 6: Download App CTA */}
      <section className="py-12 sm:py-16 bg-surface/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="flex flex-col items-center gap-8 rounded-xl border border-white/[0.06] bg-surface p-8 sm:flex-row sm:p-12">
              <div className="flex h-48 w-32 items-center justify-center rounded-2xl border border-white/[0.08] bg-elevated sm:h-56 sm:w-36">
                <Download className="h-10 w-10 text-accent-gold" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-soft-white font-playfair">
                  {t.sections.getTheApp}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t.sections.getTheAppDesc}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-elevated px-4 text-xs text-muted-foreground">
                    {t.sections.appStoreComing}
                  </div>
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-elevated px-4 text-xs text-muted-foreground">
                    {t.sections.playStoreComing}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 7: Newsletter */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-soft-white font-playfair">
                {t.sections.stayInLoop}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t.sections.stayInLoopDesc}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <Input
                  type="email"
                  placeholder={t.common.enterEmail}
                  className="sm:w-80 border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60"
                />
                <Button className="bg-accent-gold text-background hover:bg-accent-gold/90">
                  {t.common.subscribe}
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {t.common.emailRespect}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
