"use client";

import { OurApp } from "@/screens/OurApp";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

import {
  BuySection,
  FAQSection,
  HeroSection,
  IngredientsSection,
  TestimonialsSection,
} from "../screens";

export default function Home() {
  return (
    <>
      <div className="">
        <Header />
        <main>
          <HeroSection />
          <IngredientsSection />
          <BuySection />
          <TestimonialsSection />
          <OurApp />
          <FAQSection />
        </main>
      </div>
      <Footer />
    </>
  );
}
