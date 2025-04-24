"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { IngredientCard } from "../components/IngredientCard";
import ScrollReveal from "../components/ScrollReveal";
import { ingredients } from "../data/siteData";

export function IngredientsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      id="ingredients"
      ref={sectionRef}
      className="py-24 overflow-hidden relative"
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-gray-50 to-amber-50/30 -z-10"
        style={{ y: bgY }}
      />

      <div className="container mx-auto px-4 relative">
        <ScrollReveal variant="fadeInUp" duration={0.8}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powered by Nature's Best Ingredients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every scoop of Revitalife contains 22 carefully selected superfoods to support your daily wellness goals.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ingredients.map((ingredient, index) => (
            <ScrollReveal
              key={index}
              variant="fadeInUp"
              delay={0.1 * index}
              duration={0.6}
              threshold={0.1}
            >
              <motion.div
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 }
                }}
              >
                <IngredientCard
                  name={ingredient.name}
                  description={ingredient.description}
                  icon={ingredient.icon}
                />
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
