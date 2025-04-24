"use client";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import {
  AboutSection,
  BuySection,
  FAQSection,
  HeroSection,
  IngredientsSection,
  TestimonialsSection
} from "../screens";

export default function Home() {
  return (
    <>
      <div className="relative">
        <Header />
        <main>
          <HeroSection />
          <BuySection />
          <IngredientsSection />
          <FAQSection />
          <AboutSection />
          <TestimonialsSection />
        </main>
      </div>
      <Footer />
    </>
  );
}
