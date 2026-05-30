import type { Metadata } from "next";
import { AboutContent } from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "About Us | Khmer Store",
  description:
    "Learn about Khmer Store, Cambodia's premier online marketplace connecting buyers and sellers across the country.",
};

export default function AboutPage() {
  return <AboutContent />;
}
