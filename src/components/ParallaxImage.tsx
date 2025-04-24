"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  direction?: "up" | "down" | "left" | "right";
}

export default function ParallaxImage({
  src,
  alt,
  speed = 0.3,
  className = "",
  priority = false,
  fill = true,
  width,
  height,
  direction = "up",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Calculate transform based on direction
  let x, y, scale;
  const moveDistance = speed * 100;

  if (direction === "up") {
    y = useTransform(scrollYProgress, [0, 1], [moveDistance, -moveDistance]);
    x = useTransform(scrollYProgress, [0, 1], [0, 0]);
  } else if (direction === "down") {
    y = useTransform(scrollYProgress, [0, 1], [-moveDistance, moveDistance]);
    x = useTransform(scrollYProgress, [0, 1], [0, 0]);
  } else if (direction === "left") {
    x = useTransform(scrollYProgress, [0, 1], [moveDistance, -moveDistance]);
    y = useTransform(scrollYProgress, [0, 1], [0, 0]);
  } else if (direction === "right") {
    x = useTransform(scrollYProgress, [0, 1], [-moveDistance, moveDistance]);
    y = useTransform(scrollYProgress, [0, 1], [0, 0]);
  }

  // Add subtle zoom effect
  scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{
          x,
          y,
          scale
        }}
        className="relative h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          priority={priority}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
