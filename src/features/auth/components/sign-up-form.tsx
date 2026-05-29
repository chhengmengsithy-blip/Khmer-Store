"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialAuthButtons } from "./social-auth-buttons";
import { signUp } from "../actions/auth-actions";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp({ email, password });
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F2] font-[family-name:var(--font-playfair)]">
          Create Account
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Join the luxury marketplace community
        </p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-[#C6A769]" />
            <span className="text-xs text-[#C6A769]">Sign Up</span>
          </div>
          <div className="h-px w-8 bg-white/10" />
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-white/20" />
            <span className="text-xs text-[#A1A1AA]">Verify</span>
          </div>
        </div>
      </div>

      <SocialAuthButtons disabled={isLoading} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#181A20] px-2 text-[#A1A1AA]">
            or sign up with email
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
          <Label htmlFor="password" className="text-[#F5F5F2]">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="border-white/10 bg-white/5 text-[#F5F5F2] placeholder:text-[#A1A1AA]/60 focus:border-[#C6A769] focus:ring-[#C6A769]/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-[#F5F5F2]">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className="border-white/10 bg-white/5 text-[#F5F5F2] placeholder:text-[#A1A1AA]/60 focus:border-[#C6A769] focus:ring-[#C6A769]/20"
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            id="terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-[#C6A769] focus:ring-[#C6A769]/20"
          />
          <label htmlFor="terms" className="text-xs text-[#A1A1AA]">
            I agree to the{" "}
            <Link href="/terms" className="text-[#C6A769] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#C6A769] hover:underline">
              Privacy Policy
            </Link>
          </label>
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
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-sm text-[#A1A1AA]">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-[#C6A769] hover:text-[#C6A769]/80 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
