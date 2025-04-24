"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down';
  className?: string;
}

export default function ParallaxSection({
  children,
  speed = 0.2,
  direction = 'up',
  className = '',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  // Convert speed to pixels (direction affects sign)
  const speedFactor = direction === 'up' ? -speed * 100 : speed * 100;

  const y = useTransform(scrollYProgress, [0, 1], [0, speedFactor]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
