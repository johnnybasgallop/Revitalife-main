"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import ScrollReveal from "../components/ScrollReveal";

export function OurApp() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax effects for different elements
  const imageX = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const contentX = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const decorationScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);
  const decorationRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <section
      id="app"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-white overflow-hidden relative"
    >
      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-32 bg-[url('/patterns/wave-pattern.svg')] bg-repeat-x"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
      />

      <motion.div
        className="absolute -bottom-16 right-0 w-64 h-64 rounded-full bg-amber-50/60 blur-2xl"
        style={{
          scale: decorationScale,
          rotate: decorationRotate
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Image with parallax */}
          <motion.div style={{ x: imageX }} className="relative">
            <ScrollReveal variant="fadeInLeft" duration={1}>
              <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center relative overflow-hidden h-[500px]">
                {/* Subtle gradient accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-emerald-50 to-transparent rounded-full opacity-70 -z-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-50/40 to-transparent rounded-full opacity-70 -z-10"></div>

                <Image
                  src="/Yoga.png"
                  alt="Revitalife Greens Powder"
                  width={600}
                  height={600}
                  className="w-auto h-auto max-h-[100%] object-fill"
                />
                <Image
                  src="/Yoga.png"
                  alt="Revitalife Greens Powder"
                  width={600}
                  height={600}
                  className="w-auto h-auto max-h-[100%] object-fill"
                />
                <Image
                  src="/Yoga.png"
                  alt="Revitalife Greens Powder"
                  width={600}
                  height={600}
                  className="w-auto h-auto max-h-[100%] object-fill"
                />
              </div>
            </ScrollReveal>
          </motion.div>

          {/* Right side - Content with parallax */}
          <motion.div style={{ x: contentX }} className="relative">
            <ScrollReveal variant="fadeInRight" duration={1}>
              <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
                {/* Subtle gradient accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-emerald-50 to-transparent rounded-full opacity-70 -z-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-50/40 to-transparent rounded-full opacity-70 -z-10"></div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative z-10">
                  Try out our new App
                </h2>

                <div className="space-y-6 text-gray-700 relative z-10">
                  <p>
                    At Revitalife, we belive that longevitiy matters, so try out or new yoga wellness application to help you live your best life.
                  </p>

                  <div className="pl-4 border-l-4 border-emerald-400">
                    <p className="italic text-gray-600">
                      "The revitalife app is a great way to stay on top of your health and wellness."
                    </p>
                  </div>

                  <p>
                    With over 1000+ yoga classes, you'll be sure to find something that works for you.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50">
                      <div className="text-emerald-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium">Simple Signup</h3>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50">
                      <div className="text-emerald-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium">1000+ Yoga Classes</h3>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50">
                      <div className="text-emerald-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium">Detailed Tutorials</h3>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50">
                      <div className="text-emerald-500 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium">24/7 Support</h3>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
