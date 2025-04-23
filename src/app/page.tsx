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
      <main>
      <Header />
        <HeroSection />
        <BuySection />
        <IngredientsSection />
        <FAQSection />
        <AboutSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
