"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VerificationStep = 1 | 2 | 3 | 4;

interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  country: string;
  address: string;
}

export function VerificationFlow() {
  const [step, setStep] = useState<VerificationStep>(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    dateOfBirth: "",
    country: "",
    address: "",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (step < 4) setStep((step + 1) as VerificationStep);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as VerificationStep);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Submission logic handled by server action in production
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
  };

  const slideVariants = {
    enter: { x: 30, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-[#A1A1AA]">
          <span className={step >= 1 ? "text-[#C6A769]" : ""}>Personal Info</span>
          <span className={step >= 2 ? "text-[#C6A769]" : ""}>Document</span>
          <span className={step >= 3 ? "text-[#C6A769]" : ""}>Selfie</span>
          <span className={step >= 4 ? "text-[#C6A769]" : ""}>Review</span>
        </div>
        <div className="h-1 w-full rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[#C6A769]"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-[#F5F5F2]">
                Personal Information
              </h2>
              <p className="text-sm text-[#A1A1AA]">
                Please provide your legal name and details
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[#F5F5F2]">
                  Full Legal Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="As shown on your ID"
                  value={personalInfo.fullName}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, fullName: e.target.value })
                  }
                  className="border-white/10 bg-white/5 text-[#F5F5F2] placeholder:text-[#A1A1AA]/60 focus:border-[#C6A769]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="text-[#F5F5F2]">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={personalInfo.dateOfBirth}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })
                  }
                  className="border-white/10 bg-white/5 text-[#F5F5F2] focus:border-[#C6A769]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-[#F5F5F2]">
                  Country
                </Label>
                <Input
                  id="country"
                  placeholder="Your country of residence"
                  value={personalInfo.country}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, country: e.target.value })
                  }
                  className="border-white/10 bg-white/5 text-[#F5F5F2] placeholder:text-[#A1A1AA]/60 focus:border-[#C6A769]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-[#F5F5F2]">
                  Address
                </Label>
                <Input
                  id="address"
                  placeholder="Your residential address"
                  value={personalInfo.address}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, address: e.target.value })
                  }
                  className="border-white/10 bg-white/5 text-[#F5F5F2] placeholder:text-[#A1A1AA]/60 focus:border-[#C6A769]"
                />
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={
                !personalInfo.fullName ||
                !personalInfo.dateOfBirth ||
                !personalInfo.country
              }
              className="w-full bg-[#C6A769] text-[#0F1115] hover:bg-[#C6A769]/90 font-semibold"
            >
              Continue
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-[#F5F5F2]">
                Identity Document
              </h2>
              <p className="text-sm text-[#A1A1AA]">
                Upload a clear photo of your ID card or birth certificate
              </p>
            </div>

            <div
              className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-[#C6A769]/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("doc-upload")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) setDocumentFile(file);
              }}
            >
              <input
                id="doc-upload"
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setDocumentFile(file);
                }}
              />
              {documentFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#C6A769]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#C6A769]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#F5F5F2]">{documentFile.name}</p>
                  <p className="text-xs text-[#A1A1AA]">Click to change</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#F5F5F2]">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-[#A1A1AA]">
                    Supported: JPG, PNG, PDF (max 5MB)
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 border-white/10 text-[#F5F5F2] hover:bg-white/5"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!documentFile}
                className="flex-1 bg-[#C6A769] text-[#0F1115] hover:bg-[#C6A769]/90 font-semibold"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-[#F5F5F2]">
                Selfie Verification
              </h2>
              <p className="text-sm text-[#A1A1AA]">
                Take a clear selfie or upload a recent photo of yourself
              </p>
            </div>

            <div
              className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-[#C6A769]/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("selfie-upload")?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) setSelfieFile(file);
              }}
            >
              <input
                id="selfie-upload"
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelfieFile(file);
                }}
              />
              {selfieFile ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#C6A769]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#C6A769]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#F5F5F2]">{selfieFile.name}</p>
                  <p className="text-xs text-[#A1A1AA]">Click to change</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#F5F5F2]">
                    Take a photo or upload
                  </p>
                  <p className="text-xs text-[#A1A1AA]">
                    Ensure good lighting and a clear face
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 border-white/10 text-[#F5F5F2] hover:bg-white/5"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!selfieFile}
                className="flex-1 bg-[#C6A769] text-[#0F1115] hover:bg-[#C6A769]/90 font-semibold"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-[#F5F5F2]">
                Review & Submit
              </h2>
              <p className="text-sm text-[#A1A1AA]">
                Please review your information before submitting
              </p>
            </div>

            <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-xs text-[#A1A1AA]">Full Name</p>
                <p className="text-sm text-[#F5F5F2]">{personalInfo.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-[#A1A1AA]">Date of Birth</p>
                <p className="text-sm text-[#F5F5F2]">{personalInfo.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-xs text-[#A1A1AA]">Country</p>
                <p className="text-sm text-[#F5F5F2]">{personalInfo.country}</p>
              </div>
              <div>
                <p className="text-xs text-[#A1A1AA]">ID Document</p>
                <p className="text-sm text-[#F5F5F2]">{documentFile?.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#A1A1AA]">Selfie</p>
                <p className="text-sm text-[#F5F5F2]">{selfieFile?.name}</p>
              </div>
            </div>

            <div className="rounded-lg border border-[#C6A769]/20 bg-[#C6A769]/5 p-4">
              <p className="text-sm text-[#C6A769]">
                Your verification will be reviewed within 24 hours. You will
                receive a notification once the review is complete.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex-1 border-white/10 text-[#F5F5F2] hover:bg-white/5"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-[#C6A769] text-[#0F1115] hover:bg-[#C6A769]/90 font-semibold"
              >
                {isSubmitting ? "Submitting..." : "Submit Verification"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
