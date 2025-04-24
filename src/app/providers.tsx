"use client";

import { MotionConfig } from 'framer-motion';
import React from 'react';
import { SmoothScrollProvider } from '../providers/SmoothScrollProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScrollProvider>
        {children}
      </SmoothScrollProvider>
    </MotionConfig>
  );
}
