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
    offset: ["start start", "end start"],
  });

  // Parallax effect for background zoom
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Dynamic dark overlay that gets more opaque as you scroll
  const overlayOpacity = useTransform(scrollYProgress, [1, 1], [0.3, 0.7]);

  // Title and subtitle movement
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const buttonY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
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
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white opacity-80"
        >
          <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </section>
  );
}
