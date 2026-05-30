import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Favorites | Khmer Store",
  description:
    "View your favorited listings on Khmer Store. Keep track of items you love.",
};

export default function DashboardFavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
