"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialAuthButtons } from "./social-auth-buttons";
import { signIn } from "../actions/auth-actions";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn({ email, password });
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneClick = () => {
    setShowOtp(true);
  };

  if (showOtp) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-4"
      >
        <Button
          variant="ghost"
          onClick={() => setShowOtp(false)}
          className="text-[#A1A1AA] hover:text-[#F5F5F2] mb-2"
        >
          &larr; Back to sign in
        </Button>
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium text-[#F5F5F2]">
            Phone verification coming soon
          </h3>
          <p className="text-sm text-[#A1A1AA]">
            Phone OTP sign-in will be available shortly.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F2] font-[family-name:var(--font-playfair)]">
          Welcome Back
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Sign in to access your luxury marketplace
        </p>
      </div>

      <SocialAuthButtons
        onPhoneClick={handlePhoneClick}
        disabled={isLoading}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#181A20] px-2 text-[#A1A1AA]">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#F5F5F2]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="border-white/10 bg-white/5 text-[#F5F5F2] placeholder:text-[#A1A1AA]/60 focus:border-[#C6A769] focus:ring-[#C6A769]/20"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[#F5F5F2]">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-[#C6A769] hover:text-[#C6A769]/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="border-white/10 bg-white/5 text-[#F5F5F2] placeholder:text-[#A1A1AA]/60 focus:border-[#C6A769] focus:ring-[#C6A769]/20"
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#C6A769] text-[#0F1115] hover:bg-[#C6A769]/90 font-semibold transition-all duration-300"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#A1A1AA]">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="text-[#C6A769] hover:text-[#C6A769]/80 font-medium transition-colors"
        >
          Create one
        </Link>
      </p>
    </motion.div>
  );
}
