"use client";

import React, { useEffect, useRef } from 'react';
import { initCanvas } from '@/lib/canvas-utils';

export function CanvasAnimation() {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas) {
      // Store cleanup function
      cleanupRef.current = initCanvas(canvas);
    }

    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth - 20;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('focus', handleResize);

    // Cleanup
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focus', handleResize);
    };
  }, []);

  return (
    <canvas
      id="canvas"
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}