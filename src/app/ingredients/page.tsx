"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { IngredientsSection } from "@/screens/IngredientsSection";

export default function IngredientsPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24">
        <IngredientsSection />
      </main>
      <Footer />
    </div>
  );
}
