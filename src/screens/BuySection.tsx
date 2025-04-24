"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "../components/Button";
import { QuantitySelector } from "../components/QuantitySelector";
import ScrollReveal from "../components/ScrollReveal";

export function BuySection() {
  const [quantity, setQuantity] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Animations for product image
  const imageRotate = useTransform(scrollYProgress, [0, 0.8], [0, 15]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.05]);
  const imageY = useTransform(scrollYProgress, [0, 0.8], [50, -20]);

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  return (
    <section id="buy" ref={sectionRef} className="pt-20 pb-20 bg-white">
      <div className="w-full container mx-auto px-4">
        <ScrollReveal variant="fadeIn" duration={1}>
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full min-h-[70vh] mx-auto">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-emerald-50 to-amber-50/30 p-8 flex items-center justify-center h-[70vh]">
                <motion.div
                  className="relative h-[350px] w-[350px]"
                  style={{
                    rotate: imageRotate,
                    scale: imageScale,
                    y: imageY
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Image
                    src="/Product-Transparent.png"
                    alt="Revitalife Superfood Powder Package"
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <ScrollReveal variant="fadeInRight" delay={0.1} duration={0.8}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Revitalife Superfood Mix</h2>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.2} duration={0.8}>
                  <p className="text-amber-500 font-medium mb-4">Mango Flavor • 30 Servings</p>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.3} duration={0.8}>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-3xl font-bold text-gray-900">$59.99</span>
                    <span className="text-gray-500 line-through">$69.99</span>
                    <span className="bg-amber-100 text-amber-800 text-sm px-2 py-1 rounded-full ml-2">Save 15%</span>
                  </div>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.4} duration={0.8}>
                  <p className="text-gray-600 mb-8">
                    One-time purchase. Free shipping on orders over $50.
                  </p>
                </ScrollReveal>

                <ScrollReveal variant="fadeInUp" delay={0.5} duration={0.8}>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-700">Quantity:</span>
                      <QuantitySelector
                        quantity={quantity}
                        onIncrease={increaseQuantity}
                        onDecrease={decreaseQuantity}
                      />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button size="lg">Add to Cart</Button>
                    </motion.div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
