"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "../components/Button";
import ParallaxImage from "../components/ParallaxImage";
import ScrollReveal from "../components/ScrollReveal";

export function BuySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Creating parallax effects for product image and content
  const productScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1.05, 1.05, 0.9]
  );
  const productRotate = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [-5, 2, 2, -3]
  );
  const decorationY1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const decorationY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const decorationY3 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const decorationX1 = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const decorationX2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const tagTransform = (motionValue: MotionValue<number>) => {
    return {
      scale: useTransform(motionValue, [0, 0.5, 1], [0.8, 1.1, 1]),
      y: useTransform(motionValue, [0, 0.5, 1], [50, -10, 0]),
    };
  };

  return (
    <section
      id="buy"
      ref={sectionRef}
      className="relative min-h-[95vh] flex items-center py-24 lg:py-32 bg-white overflow-hidden"
    >
      {/* Decorative elements with parallax motion */}
      <motion.div
        className="absolute top-1/4 right-10 w-80 h-80 bg-green-100 rounded-full opacity-50 blur-3xl"
        style={{ y: decorationY1, x: decorationX1 }}
      />
      <motion.div
        className="absolute top-1/3 left-10 w-96 h-96 bg-amber-100 rounded-full opacity-60 blur-3xl"
        style={{ y: decorationY2, x: decorationX2 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-100 rounded-full opacity-70 blur-3xl"
        style={{ y: decorationY3 }}
      />
      <motion.div
        className="absolute -bottom-20 left-1/3 w-72 h-72 bg-blue-50 rounded-full opacity-50 blur-3xl"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [50, -30]),
          rotate: useTransform(scrollYProgress, [0, 1], [0, 15]),
        }}
      />
      <motion.div
        className="absolute top-20 left-1/4 w-32 h-32 bg-yellow-100 rounded-full opacity-60 blur-2xl"
        style={{
          y: useTransform(scrollYProgress, [0, 1], [-20, 40]),
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 1]),
        }}
      />

      <div className="w-full container mx-auto px-4">
        <ScrollReveal variant="fadeIn" duration={1}>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 lg:p-16 min-h-[600px] border border-gray-100 relative overflow-hidden">
            {/* Subtle gradient accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-transparent rounded-full opacity-80 - "></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-50/50 to-transparent rounded-full opacity-80 - "></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-gradient-to-r from-emerald-50/30 via-transparent to-blue-50/30 rounded-full blur-3xl opacity-50 - "></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center h-full">
              <div
                ref={productRef}
                className="relative flex justify-center items-center"
              >
                <motion.div
                  style={{
                    scale: productScale,
                    rotate: productRotate,
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                  className="relative max-w-lg mx-auto"
                >
                  <ParallaxImage
                    src="/Product-AI.png"
                    alt="Revitalife Greens Powder"
                    className="w-2/3 h-auto mx-auto"
                    fill={false}
                    width={500}
                    height={500}
                    speed={0.1}
                    direction="up"
                  />
                </motion.div>
              </div>

              <div>
                <ScrollReveal variant="fadeInRight" duration={0.8}>
                  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                    Revitalife Superfood Mix
                  </h2>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.1} duration={0.8}>
                  <p className="text-xl text-amber-500 font-medium mb-4">
                    Mango Flavor • 30 Servings
                  </p>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.2} duration={0.8}>
                  <div className="flex items-end mb-6">
                    <p className="text-4xl font-bold text-gray-900">$59.99</p>
                    <p className="text-xl text-gray-500 line-through ml-2">
                      $69.99
                    </p>
                    <p className="text-sm text-emerald-600 font-semibold ml-3 px-2 py-1 bg-emerald-50 rounded">
                      Save 15%
                    </p>
                  </div>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.3} duration={0.8}>
                  <p className="text-gray-600 mb-8">
                    One-time purchase. Free shipping on orders over $50.
                  </p>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.4} duration={0.8}>
                  <div className="flex items-center mb-10">
                    <p className="text-gray-700 mr-4">Quantity:</p>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                        -
                      </button>
                      <span className="px-5 py-2 border-l border-r border-gray-300">
                        1
                      </span>
                      <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                        +
                      </button>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal variant="fadeInRight" delay={0.5} duration={0.8}>
                  <Button
                    size="lg"
                    className="w-full md:w-auto text-lg py-3 px-8"
                  >
                    Add to Cart
                  </Button>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
