"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Headphones, Award } from "lucide-react";
import { ScrollReveal } from "@/components/animations/scroll-reveal";

const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Verified Sellers",
    description: "Every seller is vetted and verified for authenticity",
  },
  {
    icon: Lock,
    title: "Secure Escrow",
    description: "Your payment is protected until delivery is confirmed",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support team available around the clock",
  },
  {
    icon: Award,
    title: "Satisfaction Guarantee",
    description: "Full refund if the item does not match its description",
  },
];

export function TrustSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-playfair text-3xl font-bold text-soft-white">
              Why Choose Us
            </h2>
            <p className="mt-2 text-muted-foreground">
              Built on trust, security, and exceptional service
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: premiumEasing,
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/10">
                <item.icon className="h-6 w-6 text-accent-gold" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-soft-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
