import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Discover authentic Cambodian products from verified sellers",
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
