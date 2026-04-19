// @/page.tsx
import HeroCarousel from "@/components/HeroCarousel";
import SpecialOffers from "@/components/SpecialOffers";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import ProductsByCategory from "@/components/ProductsByCategory";

export default async function Home() {
  return (
    <>
      <HeroCarousel />
      <SpecialOffers />
      <ProductsByCategory />
      <CTASection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
