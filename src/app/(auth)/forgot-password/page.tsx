"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { resetPassword } from "@/features/auth/actions/auth-actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await resetPassword({ email });
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="border-white/10 bg-elevated">
        <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/10">
            <Mail className="h-8 w-8 text-accent-gold" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-soft-white font-playfair">
              Check Your Email
            </h1>
            <p className="text-sm text-muted-foreground max-w-sm">
              If an account exists with that email, we sent a password reset
              link. Please check your inbox.
            </p>
          </div>
          <Button
            variant="ghost"
            asChild
            className="text-accent-gold hover:text-accent-gold/80"
          >
            <Link href="/sign-in">Back to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
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
        <h1 className="text-3xl font-bold tracking-tight text-soft-white font-playfair">
          Forgot Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we will send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-soft-white">
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
            className="border-white/10 bg-white/5 text-soft-white placeholder:text-muted-foreground/60 focus:border-accent-gold focus:ring-accent-gold/20"
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
          className="w-full bg-accent-gold text-background hover:bg-accent-gold/90 font-semibold transition-all duration-300"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent-gold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </div>
    </motion.div>
  );
}
