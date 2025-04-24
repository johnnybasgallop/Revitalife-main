"use client";

import { motion, useInView, Variant } from "framer-motion";
import { ReactNode, useRef } from "react";

type RevealVariant =
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "zoomIn"
  | "stagger";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  custom?: any;
}

const variants = {
  hidden: {
    opacity: 0,
    y: 0,
    x: 0,
    scale: 1,
  },
  fadeIn: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
  fadeInUp: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      y: { type: "spring", stiffness: 50 },
    },
  },
  fadeInDown: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      y: { type: "spring", stiffness: 50 },
    },
  },
  fadeInLeft: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      x: { type: "spring", stiffness: 50 },
    },
  },
  fadeInRight: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      x: { type: "spring", stiffness: 50 },
    },
  },
  zoomIn: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      scale: { type: "spring", stiffness: 50 },
    },
  },
  stagger: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
    },
  }),
};

const hiddenVariants = {
  fadeIn: { opacity: 0 },
  fadeInUp: { opacity: 0, y: 40 },
  fadeInDown: { opacity: 0, y: -40 },
  fadeInLeft: { opacity: 0, x: -40 },
  fadeInRight: { opacity: 0, x: 40 },
  zoomIn: { opacity: 0, scale: 0.9 },
  stagger: { opacity: 0, y: 40 },
};

export default function ScrollReveal({
  children,
  variant = "fadeIn",
  delay = 0,
  duration = 0.5,
  threshold = 0.2,
  once = true,
  className = "",
  custom,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const getHiddenVariant = () => {
    return hiddenVariants[variant] || hiddenVariants.fadeIn;
  };

  const getVisibleVariant = (): Variant => {
    if (variant === "stagger" && custom !== undefined) {
      return variants.stagger(custom);
    }
    return variants[variant] || variants.fadeIn;
  };

  const getTransition = () => {
    const baseTransition = { delay, duration };
    return variant === "stagger" ? undefined : baseTransition;
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: getHiddenVariant(),
        visible: getVisibleVariant(),
      }}
      transition={getTransition()}
      className={className}
    >
      {children}
    </motion.div>
  );
}
