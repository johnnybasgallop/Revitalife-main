"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  className?: string;
  bgColor?: string;
  opacity?: [number, number];
  scale?: [number, number];
}

export default function ParallaxSection({
  children,
  speed = 0.2,
  direction = 'up',
  className = '',
  bgColor,
  opacity,
  scale,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  // Convert speed to pixels (direction affects sign)
  const speedFactor = direction === 'up' ? -speed * 100 : speed * 100;
  const y = useTransform(scrollYProgress, [0, 1], [0, speedFactor]);

  // Optional styles
  const opacityValue = opacity ? useTransform(scrollYProgress, [0, 0.5, 1], [opacity[0], 1, opacity[1]]) : undefined;
  const scaleValue = scale ? useTransform(scrollYProgress, [0, 0.5, 1], [scale[0], 1, scale[1]]) : undefined;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <motion.div
        style={{
          y,
          opacity: opacityValue,
          scale: scaleValue
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
