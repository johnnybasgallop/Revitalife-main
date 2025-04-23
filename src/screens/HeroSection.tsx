"use client";

import Image from "next/image";
import { Button } from "../components/Button";

export function HeroSection() {
  return (
    <section className="min-h-[90vh] w-full flex items-center bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center justify-around">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Daily Wellness in a Scoop
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Revitalife combines 22 powerful superfoods in a delicious mango-flavored powder. Give your body what it needs to thrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })}>
              Shop Now
            </Button>
            <Button variant="secondary" size="lg">
              Learn More
            </Button>
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative h-[400px] w-[400px] md:h-[500px] md:w-[500px]">
            <Image
              src="/Product-Single.png"
              alt="Revitalife Superfood Powder"
              fill
              priority
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
