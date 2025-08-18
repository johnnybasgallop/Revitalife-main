"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "../components/ScrollReveal";

export function OurApp() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Set up event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects only for desktop
  const imageX = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0, 0] : [50, -50]
  );
  const contentX = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0, 0] : [-50, 50]
  );
  const decorationScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isMobile ? [1, 1, 1] : [0.8, 1.2, 0.9]
  );
  const decorationRotate = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0, 0] : [0, 15]
  );
  const waveY = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0, 0] : [0, -50]
  );

  return (
    <section
      id="app"
      ref={sectionRef}
      className="py-24 min-h-[95vh] lg:py-32 bg-white overflow-hidden relative"
    >
      {/* Decorative elements - hidden on mobile */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full h-32 bg-[url('/patterns/wave-pattern.svg')] bg-repeat-x"
            style={{ y: waveY }}
          />
          <motion.div
            className="absolute -bottom-16 right-0 w-64 h-64 rounded-full bg-amber-50/60 blur-2xl"
            style={{
              scale: decorationScale,
              rotate: decorationRotate,
            }}
          />
        </>
      )}

      <div className="container mx-auto px-4 relative">
        <div
          className={`grid grid-cols-1 ${
            isMobile ? "" : "lg:grid-cols-2"
          } gap-8 lg:gap-16 items-center`}
        >
          {/* Image section with conditional styling */}
          <div className={`${isMobile ? "flex justify-center mb-8" : ""}`}>
            {isMobile ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center relative overflow-hidden max-w-md mx-auto">
                {/* Simple gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-emerald-50 to-transparent rounded-full opacity-70 - "></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-50/40 to-transparent rounded-full opacity-70 - "></div>

                <Image
                  src="/Yoga.png"
                  alt="Revitalife Yoga App"
                  width={400}
                  height={400}
                  className="w-auto h-auto max-h-[400px] object-contain"
                />
              </div>
            ) : (
              <motion.div style={{ x: imageX }} className="relative">
                <ScrollReveal variant="fadeInLeft" duration={1}>
                  <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center relative overflow-hidden h-[500px]">
                    {/* Subtle gradient accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-emerald-50 to-transparent rounded-full opacity-70 - "></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-50/40 to-transparent rounded-full opacity-70 - "></div>

                    <Image
                      src="/Yoga.png"
                      alt="Revitalife Yoga App"
                      width={600}
                      height={600}
                      className="w-auto h-auto max-h-[100%] object-fill"
                    />
                  </div>
                </ScrollReveal>
              </motion.div>
            )}
          </div>

          {/* Content section with conditional styling */}
          <div className={`${isMobile ? "text-center" : ""}`}>
            {isMobile ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden max-w-md mx-auto">
                {/* Simple gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-emerald-50 to-transparent rounded-full opacity-70 - "></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-50/40 to-transparent rounded-full opacity-70 - "></div>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 relative  ">
                  Try out our new App
                </h2>

                <div className="space-y-6 text-gray-700 relative  ">
                  <p>
                    At Revitalife, we belive that longevitiy matters, so try out
                    or new yoga wellness application to help you live your best
                    life.
                  </p>

                  <div className="pl-4 border-l-4 border-emerald-400 text-left">
                    <p className="italic text-gray-600">
                      "The revitalife app is a great way to stay on top of your
                      health and wellness."
                    </p>
                  </div>

                  <p>
                    With over 1000+ yoga classes, you'll be sure to find
                    something that works for you.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50 text-left">
                      <div className="text-emerald-500 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-medium">Simple Signup</h3>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50 text-left">
                      <div className="text-emerald-500 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-medium">1000+ Classes</h3>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50 text-left">
                      <div className="text-emerald-500 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-medium">Tutorials</h3>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50 text-left">
                      <div className="text-emerald-500 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-medium">24/7 Support</h3>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div style={{ x: contentX }} className="relative">
                <ScrollReveal variant="fadeInRight" duration={1}>
                  <div className="bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
                    {/* Subtle gradient accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-emerald-50 to-transparent rounded-full opacity-70 - "></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-50/40 to-transparent rounded-full opacity-70 - "></div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative  ">
                      Try out our new App
                    </h2>

                    <div className="space-y-6 text-gray-700 relative  ">
                      <p>
                        At Revitalife, we belive that longevitiy matters, so try
                        out or new yoga wellness application to help you live
                        your best life.
                      </p>

                      <div className="pl-4 border-l-4 border-emerald-400">
                        <p className="italic text-gray-600">
                          "The revitalife app is a great way to stay on top of
                          your health and wellness."
                        </p>
                      </div>

                      <p>
                        With over 1000+ yoga classes, you'll be sure to find
                        something that works for you.
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50">
                          <div className="text-emerald-500 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-medium">Simple Signup</h3>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50">
                          <div className="text-emerald-500 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-medium">1000+ Yoga Classes</h3>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50">
                          <div className="text-emerald-500 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-medium">Detailed Tutorials</h3>
                        </div>

                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-emerald-50">
                          <div className="text-emerald-500 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="font-medium">24/7 Support</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
