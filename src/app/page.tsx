import HeroCarousel from "@/components/HeroCarousel";
import SpecialOffers from "@/components/SpecialOffers";
import ProductsByCategory from "@/components/ProductsByCategory";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";

const Home = () => {
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
};

export default Home;
