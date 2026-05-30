"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroScene } from "@/components/3d/hero-scene";

const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-surface" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(198,167,105,0.08),transparent_50%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-32 lg:grid-cols-2">
        {/* Left: Content */}
        <div className="relative flex flex-col gap-6">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-accent-gold/5 blur-3xl" aria-hidden="true" />
          <motion.h1
            className="font-playfair text-4xl font-bold leading-tight text-soft-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: premiumEasing }}
          >
            Discover{" "}
            <span className="text-accent-gold">Extraordinary</span>
          </motion.h1>

          <motion.p
            className="max-w-md text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: premiumEasing }}
          >
            A curated luxury marketplace where exceptional artisans meet
            discerning collectors. Explore verified sellers and extraordinary
            finds.
          </motion.p>

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: premiumEasing }}
          >
            <Button className="bg-accent-gold text-background hover:bg-accent-gold/90 px-6 h-11">
              Explore Marketplace
            </Button>
            <Button
              variant="outline"
              className="border-white/[0.12] text-soft-white hover:bg-white/[0.04] px-6 h-11"
            >
              Become a Seller
            </Button>
          </motion.div>
        </div>

        {/* Right: 3D Scene */}
        <motion.div
          className="hidden h-[500px] lg:block"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: premiumEasing }}
        >
          <HeroScene />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: premiumEasing }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
