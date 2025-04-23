"use client";

import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-emerald-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 relative">
              <Image
                src="/founder.jpg"
                alt="Founder"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">Dr. Emma Chen</h3>
            <p className="text-gray-600">Founder & Nutritionist</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <div className="text-lg text-gray-700 space-y-4">
            <p>
              "I created Revitalife after years of seeing patients struggle to get the nutrients they needed from their modern diets. Our mission is simple: to make complete daily nutrition accessible, convenient, and actually enjoyable.
            </p>
            <p>
              Each ingredient in our formula was selected based on scientific research and traditional wellness practices. We're committed to using only the highest quality, sustainably sourced ingredients, with full transparency about what goes into each package.
            </p>
            <p>
              Revitalife isn't just a supplement – it's a daily ritual that empowers you to take control of your health journey."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
