import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace | Khmer Store",
  description:
    "Browse thousands of listings across Cambodia. Find vehicles, property, electronics, jobs, and more on Khmer Store marketplace.",
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
