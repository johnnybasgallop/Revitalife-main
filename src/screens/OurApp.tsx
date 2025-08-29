"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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
      className="py-24 min-h-[80vh] lg:py-40 bg-[#7F9F4B]/14 overflow-hidden relative"
    >
      {/* Decorative elements - hidden on mobile
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full h-32 bg-[url('/patterns/wave-pattern.svg')] bg-repeat-x"
            style={{ y: waveY }}
          />
          <motion.div
            className="absolute -bottom-16 right-0 w-64 h-64 rounded-full bg-emerald-50/60 blur-2xl"
            style={{
              scale: decorationScale,
              rotate: decorationRotate,
            }}
          />
        </>
      )} */}

      <div className="container mx-auto px-4 relative">
        <div
          className={`grid grid-cols-1 ${
            isMobile ? "" : "lg:grid-cols-2"
          } gap-8 lg:gap-16 items-center`}
        >
          {/* Content section with conditional styling - Mobile: Coming Soon First */}
          <div className={`${isMobile ? "text-center" : ""}`}>
            {isMobile ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden max-w-md mx-auto">
                {/* Simple gradients */}

                <h2 className="text-3xl font-bold text-gray-900 mb-6 relative  ">
                  New App Coming Soon
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
                      <div className="text-emerald-900/80 mb-2">
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
                      <div className="text-emerald-900/80 mb-2">
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
                      <div className="text-emerald-900/80 mb-2">
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
                      <div className="text-emerald-900/80 mb-2">
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

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 relative  ">
                      New App Coming Soon...
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
                          <div className="text-emerald-900/80 mb-2">
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
                          <div className="text-emerald-900/80 mb-2">
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
                          <div className="text-emerald-900/80 mb-2">
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
                          <div className="text-emerald-900/80 mb-2">
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

          {/* App Sign-up Form - Mobile: Signup Second */}
          <div className={`${isMobile ? "flex justify-center" : ""}`}>
            {isMobile ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center relative overflow-hidden max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                  Get Early Access
                </h2>
                <p className="text-lg text-gray-600 mb-8 text-center">
                  Be the first to know when our wellness app launches. Get
                  exclusive early access and special offers.
                </p>

                <form className="w-full space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-900/80 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-900/80 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number{" "}
                      <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-900/80 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      className="mt-1 h-4 w-4 text-emerald-900/80 focus:ring-emerald-900/80 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="notifications"
                      className="text-sm text-gray-600"
                    >
                      I want to receive updates about new features, wellness
                      tips, and exclusive offers
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-900/80 to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Early Access
                  </button>
                </form>

                <div className="flex flex-col items-center space-y-2 mt-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-900/80 rounded-full"></div>
                    <span>Free to join</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-900/80 rounded-full"></div>
                    <span>No spam</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-900/80 rounded-full"></div>
                    <span>Unsubscribe anytime</span>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div style={{ x: imageX }} className="relative">
                <ScrollReveal variant="fadeInLeft" duration={1}>
                  <div className="bg-white rounded-2xl shadow-lg px-8 py-10 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                      Get Early Access
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
                      Be the first to know when our wellness app launches. Get
                      exclusive early access and special offers.
                    </p>

                    <form className="w-full max-w-md space-y-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-900/80 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-900/80 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          placeholder="your@email.com"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number{" "}
                          <span className="text-gray-400">(Optional)</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-900/80 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="notifications"
                          name="notifications"
                          className="mt-1 h-4 w-4 text-emerald-900/80 focus:ring-emerald-900/80 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="notifications"
                          className="text-sm text-gray-600"
                        >
                          I want to receive updates about new features, wellness
                          tips, and exclusive offers
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-900/80 text-white font-semibold py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Get Early Access
                      </button>
                    </form>

                    <div className="flex items-center space-x-4 mt-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-900/80 rounded-full"></div>
                        <span>Free to join</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-900/80 rounded-full"></div>
                        <span>No spam</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-900/80 rounded-full"></div>
                        <span>Unsubscribe anytime</span>
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
