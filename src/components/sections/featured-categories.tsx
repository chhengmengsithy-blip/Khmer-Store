"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { Palette, Gem, Shirt, Watch, Trophy, Home } from "lucide-react";

const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const categories = [
  { name: "Art", icon: Palette },
  { name: "Jewelry", icon: Gem },
  { name: "Fashion", icon: Shirt },
  { name: "Watches", icon: Watch },
  { name: "Collectibles", icon: Trophy },
  { name: "Home", icon: Home },
];

export function FeaturedCategories() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="font-playfair text-3xl font-bold text-soft-white">
            Explore Categories
          </h2>
          <p className="mt-2 text-muted-foreground">
            Curated collections across luxury segments
          </p>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => (
            <motion.a
              key={category.name}
              href={`/category/${category.name.toLowerCase()}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-surface p-6 transition-colors hover:border-accent-gold/30 hover:bg-elevated"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: premiumEasing,
              }}
              whileHover={{ scale: 1.03 }}
            >
              <category.icon className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-accent-gold" />
              <span className="text-sm font-medium text-soft-white">
                {category.name}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
