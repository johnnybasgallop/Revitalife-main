"use client";

import Image from "next/image";
import { Button } from "../components/Button";

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] w-full flex items-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero-image/Runway 2025-04-24T18_55_58.805Z Expand Image.jpg"
        alt="Green background"
        fill
        priority
        className="object-cover absolute inset-0"
        style={{ zIndex: 1 }}
      />

      {/* Dark overlay - with higher opacity for better visibility */}
      <div
        className="absolute inset-0 bg-black opacity-70"
        style={{ zIndex: 2 }}
      ></div>

      {/* Content */}
      <div
        className="container mx-auto px-4 py-20 flex flex-col items-center text-center relative"
        style={{ zIndex: 3 }}
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          ESSENTIAL GREENS BLEND
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl">
          22 superfoods for daily wellness in one delicious scoop
        </p>

        <div className="mt-6">
          <Button
            size="lg"
            onClick={() => document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Shop Now
          </Button>
        </div>

        {/* Circular indicator */}
        <div className="h-12 w-12 border-2 border-amber-500 rounded-full mt-16 flex items-center justify-center">
          <div className="h-8 w-8 bg-amber-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
