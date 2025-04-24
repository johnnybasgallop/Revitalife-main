"use client";

import Lenis from '@studio-freight/lenis';
import { createContext, useContext, useEffect, useState } from 'react';

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollY: number;
  scrollYProgress: number;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollY: 0,
  scrollYProgress: 0
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export function SmoothScrollProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      smoothWheel: true,
      touchMultiplier: 2,
    });

    setLenis(lenisInstance);

    // Track scroll position for parallax effects
    lenisInstance.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
      setScrollY(scroll);
      setScrollYProgress(scroll / limit);
    });

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis, scrollY, scrollYProgress }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
