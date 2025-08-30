"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { BuySection } from "@/screens/BuySection";

export default function BuyNowPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <BuySection />
      </main>
      <Footer />
    </div>
  );
}
