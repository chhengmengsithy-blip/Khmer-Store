import { redirect } from "next/navigation";
import { getProfile } from "@/features/dashboard/actions/settings-actions";
import { SettingsClient } from "@/features/dashboard/components/settings-client";

export default async function SettingsPage() {
  const result = await getProfile();

  if ("error" in result && result.error === "Not authenticated") {
    redirect("/sign-in");
  }

  // If there was some other error, still render the page with empty defaults
  const profile = "error" in result && !("full_name" in result)
    ? { full_name: "", display_name: "", email: "", phone: "", country: "", bio: "", avatar_url: "" }
    : result;

  return (
    <SettingsClient
      fullName={(profile as { full_name: string }).full_name}
      displayName={(profile as { display_name: string }).display_name}
      email={(profile as { email: string }).email}
      phone={(profile as { phone: string }).phone}
      country={(profile as { country: string }).country}
      bio={(profile as { bio: string }).bio}
      avatarUrl={(profile as { avatar_url: string }).avatar_url}
    />
  );
}
