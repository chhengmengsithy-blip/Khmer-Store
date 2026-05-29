import { HeroSection } from "@/components/sections/hero-section";
import { FeaturedCategories } from "@/components/sections/featured-categories";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { TrustSection } from "@/components/sections/trust-section";
import { CTASection } from "@/components/sections/cta-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <TrustSection />
      <CTASection />
    </main>
  );
}
