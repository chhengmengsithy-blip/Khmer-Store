"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface OtpVerificationProps {
  onVerify: (otp: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  error?: string;
}

export function OtpVerification({
  onVerify,
  onResend,
  isLoading = false,
  error,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setCanResend(true);
        }
        return next;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== "") && value) {
        onVerify(newOtp.join(""));
      }
    },
    [otp, onVerify]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (pasted.length === 0) return;

      const newOtp = [...otp];
      for (let i = 0; i < pasted.length && i < 6; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);

      const nextEmptyIndex = newOtp.findIndex((d) => d === "");
      if (nextEmptyIndex === -1) {
        inputRefs.current[5]?.focus();
        onVerify(newOtp.join(""));
      } else {
        inputRefs.current[nextEmptyIndex]?.focus();
      }
    },
    [otp, onVerify]
  );

  const handleResend = () => {
    setCanResend(false);
    setCountdown(60);
    setOtp(Array(6).fill(""));
    inputRefs.current[0]?.focus();
    onResend();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-[#F5F5F2]">
          Verify your identity
        </h2>
        <p className="text-sm text-[#A1A1AA]">
          Enter the 6-digit code sent to your phone
        </p>
      </div>

      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isLoading}
            className="h-12 w-12 text-center text-lg font-semibold border-white/10 bg-white/5 focus:border-[#C6A769] focus:ring-[#C6A769]/20"
          />
        ))}
      </div>

      {error && (
        <p className="text-center text-sm text-red-400">{error}</p>
      )}

      <div className="text-center">
        {canResend ? (
          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            className="text-[#C6A769] hover:text-[#C6A769]/80"
          >
            Resend code
          </Button>
        ) : (
          <p className="text-sm text-[#A1A1AA]">
            Resend code in{" "}
            <span className="text-[#C6A769] font-medium">{countdown}s</span>
          </p>
        )}
      </div>
    </motion.div>
  );
}
