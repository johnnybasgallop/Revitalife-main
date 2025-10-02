"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NutritionistPage } from "@/screens";

export default function OurNutritionist() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <NutritionistPage />
      </main>
      <Footer />
    </div>
  );
}
