"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

export function CTASection() {
  return (
    <section className="py-24 bg-surface">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <h2 className="font-playfair text-3xl font-bold text-soft-white sm:text-4xl">
              Share Your Craft With the World
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Join our community of verified sellers and reach discerning
              collectors who value quality and authenticity. Zero listing fees
              for the first month.
            </p>
            <div className="mt-8">
              <Button className="bg-accent-gold text-background hover:bg-accent-gold/90 px-8 h-11">
                Start Selling
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/[0.06] bg-elevated p-6">
                <p className="text-2xl font-bold text-accent-gold">2,500+</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Active Sellers
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-elevated p-6">
                <p className="text-2xl font-bold text-accent-gold">50K+</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Products Listed
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-elevated p-6">
                <p className="text-2xl font-bold text-accent-gold">98%</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Satisfaction Rate
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-elevated p-6">
                <p className="text-2xl font-bold text-accent-gold">$2M+</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Monthly Sales
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
