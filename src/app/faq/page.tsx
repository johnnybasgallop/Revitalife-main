"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FAQSection } from "@/screens/FAQSection";

export default function FAQPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
