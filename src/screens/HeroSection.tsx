"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "../components/Button";
import ScrollReveal from "../components/ScrollReveal";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Parallax and opacity animations based on scroll
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.7, 0.9]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const subtitleY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const buttonY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const indicatorY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <section ref={sectionRef} className="relative min-h-[100vh] w-full flex items-center overflow-hidden">
      {/* Background image with parallax effect */}
      <motion.div
        className="absolute inset-0"
        style={{ scale }}
      >
        <Image
          src="/hero-image/Runway 2025-04-24T18_55_58.805Z Expand Image.jpg"
          alt="Green background"
          fill
          priority
          className="object-cover absolute inset-0"
          style={{ zIndex: 1 }}
        />
      </motion.div>

      {/* Dark overlay with dynamic opacity */}
      <motion.div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity, zIndex: 2 }}
      ></motion.div>

      {/* Content with staggered animations */}
      <div
        className="container mx-auto px-4 py-20 flex flex-col items-center text-center relative"
        style={{ zIndex: 3 }}
      >
        <ScrollReveal variant="fadeInDown" duration={0.8}>
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            style={{ y: titleY }}
          >
            ESSENTIAL GREENS BLEND
          </motion.h1>
        </ScrollReveal>

        <ScrollReveal variant="fadeInUp" delay={0.2} duration={0.8}>
          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl"
            style={{ y: subtitleY }}
          >
            22 superfoods for daily wellness in one delicious scoop
          </motion.p>
        </ScrollReveal>

        <ScrollReveal variant="zoomIn" delay={0.4} duration={0.8}>
          <motion.div
            className="mt-6"
            style={{ y: buttonY }}
          >
            <Button
              size="lg"
              onClick={() => document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Shop Now
            </Button>
          </motion.div>
        </ScrollReveal>

        {/* Circular indicator with pulse animation */}
        <motion.div
          className="h-12 w-12 border-2 border-amber-500 rounded-full mt-16 flex items-center justify-center"
          style={{ y: indicatorY }}
          animate={{
            boxShadow: ["0 0 0 0 rgba(251, 191, 36, 0.4)", "0 0 0 10px rgba(251, 191, 36, 0)"]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <div className="h-8 w-8 bg-amber-500 rounded-full"></div>
        </motion.div>
      </div>
    </section>
  );
}
