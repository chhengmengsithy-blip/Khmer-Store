import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Listings | Khmer Store",
  description:
    "Manage your listings on Khmer Store. View, edit, and track your active posts.",
};

export default function DashboardListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
