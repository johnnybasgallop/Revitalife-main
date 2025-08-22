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
      className="relative min-h-screen md:min-h-[87vh] flex items-end justify-center md:items-center md:justify-start overflow-hidden"
    >
      {/* Background image with parallax effect */}
      <motion.div className="">
        <Image
          // src="/hero-image/Runway 2025-04-24T18_55_58.805Z Expand Image.jpg"
          // src="/Product-Double.jpg"
          src="/backdrop5.png"
          alt="Green background"
          fill
          priority
          className="object-cover md:flex hidden"
          style={{ zIndex: 1 }}
        />
      </motion.div>

      <motion.div className="">
        <Image
          // src="/hero-image/Runway 2025-04-24T18_55_58.805Z Expand Image.jpg"
          // src="/Product-Double.jpg"
          src="/mobile-backdrop.png"
          alt="Green background"
          fill
          priority
          className="object-cover max-h-[87vh] 2xl:object-fill md:hidden flex"
          style={{ zIndex: 1 }}
        />
      </motion.div>

      {/* Content with staggered animations */}
      <div
        className="mb-15 px-20 pb-30 md:py-20 flex flex-col items-start"
        style={{ zIndex: 3 }}
      >
        <ScrollReveal variant="fadeInDown" duration={0.8}>
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-[#504C4B] font-semibold mb-6 leading-12 md:leading-20 lg:leading-27 xl:leading-30">
            Essential Greens
            <br />
            Blend
          </motion.h1>
        </ScrollReveal>

        <ScrollReveal variant="fadeInUp" delay={0.2} duration={0.8}>
          <motion.p className="text-xl md:text-4xl font-bold text-[#504C4B]/85  px-2 mt-0 mb-4 md:mb-15 max-w-2xl">
            22 Superfoods
          </motion.p>
        </ScrollReveal>

        <ScrollReveal variant="zoomIn" delay={0.4} duration={0.8}>
          <motion.div className="mt-5 min-w-[300px]" style={{ y: buttonY }}>
            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById("buy")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-full"
            >
              Shop Now
            </Button>
          </motion.div>
        </ScrollReveal>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className=" "
        animate={{ y: [0, 10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
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
          <path
            d="M12 5L12 19M12 19L19 12M12 19L5 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  );
}
