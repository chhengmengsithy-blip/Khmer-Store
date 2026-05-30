import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post a Listing | Khmer Store",
  description:
    "Create a new listing on Khmer Store. Sell your items to buyers across Cambodia.",
};

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
