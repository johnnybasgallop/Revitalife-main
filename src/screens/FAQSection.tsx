"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FAQAccordion } from "../components/FAQAccordion";
import ScrollReveal from "../components/ScrollReveal";
import { faqs } from "../data/siteData";

export function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const titleScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <section id="faq" ref={sectionRef} className="py-28 bg-white relative overflow-hidden">
      <motion.div
        className="absolute -right-20 -top-20 w-96 h-96 bg-amber-100 rounded-full opacity-20 blur-3xl"
        style={{
          x: useTransform(scrollYProgress, [0, 1], [-50, 100]),
          y: useTransform(scrollYProgress, [0, 1], [-80, 100]),
        }}
      />

      <motion.div
        className="absolute -left-40 -bottom-40 w-[30rem] h-[30rem] bg-amber-200 rounded-full opacity-10 blur-3xl"
        style={{
          x: useTransform(scrollYProgress, [0, 1], [-100, 50]),
          y: useTransform(scrollYProgress, [0, 1], [100, -50]),
        }}
      />

      <div className="container mx-auto px-4 relative">
        <motion.div
          className="text-center mb-16"
          style={{
            opacity: titleOpacity,
            scale: titleScale
          }}
        >
          <ScrollReveal variant="fadeIn" duration={0.8}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about Revitalife.
            </p>
          </ScrollReveal>
        </motion.div>

        <ScrollReveal variant="fadeInUp" duration={1}>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={faqs} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
