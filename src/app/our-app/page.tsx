"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { OurApp } from "@/screens/OurApp";

export default function OurAppPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <OurApp />
      </main>
      <Footer />
    </div>
  );
}
