"use server";

import { createClient } from "@/lib/supabase/server";

interface VerificationResult {
  error?: string;
  success?: boolean;
}

export async function submitVerification(
  formData: FormData
): Promise<VerificationResult> {
  const supabase = await createClient();

  if (!supabase) {
    return { error: "Service is not configured." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to submit verification." };
  }

  const fullName = formData.get("fullName") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const country = formData.get("country") as string;
  const address = formData.get("address") as string;

  if (!fullName || !dateOfBirth || !country) {
    return { error: "Please fill in all required fields." };
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    user_id: user.id,
    full_name: fullName,
    date_of_birth: dateOfBirth,
    country,
    address,
  });

  if (profileError) {
    return { error: "Failed to save personal information." };
  }

  const { error: statusError } = await supabase
    .from("users_extended")
    .update({ verification_status: "pending_verification" })
    .eq("auth_user_id", user.id);

  if (statusError) {
    return { error: "Failed to update verification status." };
  }

  return { success: true };
}

export async function uploadDocument(
  formData: FormData
): Promise<VerificationResult> {
  const supabase = await createClient();

  if (!supabase) {
    return { error: "Service is not configured." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to upload documents." };
  }

  const file = formData.get("file") as File;
  const documentType = formData.get("type") as string;

  if (!file || !documentType) {
    return { error: "Please provide a file and document type." };
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("verification-documents")
    .upload(fileName, file);

  if (uploadError) {
    return { error: "Failed to upload document." };
  }

  const { data: urlData } = supabase.storage
    .from("verification-documents")
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase
    .from("verification_documents")
    .insert({
      user_id: user.id,
      type: documentType,
      file_url: urlData.publicUrl,
      status: "pending",
    });

  if (dbError) {
    return { error: "Failed to record document." };
  }

  return { success: true };
}

export async function getVerificationStatus(): Promise<{
  status: string;
  rejectionReason?: string;
} | null> {
  const supabase = await createClient();

  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("users_extended")
    .select("verification_status")
    .eq("auth_user_id", user.id)
    .single();

  if (!data) return null;

  const { data: latestDoc } = await supabase
    .from("verification_documents")
    .select("status, rejection_reason")
    .eq("user_id", user.id)
    .eq("status", "rejected")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  return {
    status: data.verification_status,
    rejectionReason: latestDoc?.rejection_reason || undefined,
  };
}
