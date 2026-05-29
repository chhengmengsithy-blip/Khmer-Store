"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: premiumEasing }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
