import { redirect } from "next/navigation";
import { getProfile } from "@/features/dashboard/actions/settings-actions";
import { SettingsClient } from "@/features/dashboard/components/settings-client";

export default async function SettingsPage() {
  const result = await getProfile();

  if (!result.success) {
    if (result.error === "Not authenticated") {
      redirect("/sign-in");
    }

    // If there was some other error, render the page with empty defaults
    return (
      <SettingsClient
        fullName=""
        displayName=""
        email=""
        phone=""
        country=""
        bio=""
        avatarUrl=""
      />
    );
  }

  return (
    <SettingsClient
      fullName={result.data.full_name}
      displayName={result.data.display_name}
      email={result.data.email}
      phone={result.data.phone}
      country={result.data.country}
      bio={result.data.bio}
      avatarUrl={result.data.avatar_url}
    />
  );
}
