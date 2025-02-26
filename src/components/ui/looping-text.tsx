"use client"

import { useEffect, useState } from "react"
import { TextEffect } from "./text-effect"

interface LoopingTextProps {
  children: string;
  className?: string;
}

export function LoopingText({ children, className }: LoopingTextProps) {
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrigger(false);
      setTimeout(() => setTrigger(true), 100);
    }, 5000); // Reset every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <TextEffect
      per="char"
      className={className}
      trigger={trigger}
      variants={{
        container: {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.015,
              delayChildren: 0.3
            },
          },
        },
        item: {
          hidden: {
            opacity: 0,
            y: 10,
            rotateX: 90,
            filter: "blur(10px)"
          },
          visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              damping: 15,
              stiffness: 200,
              mass: 0.8
            },
          },
        },
      }}
    >
      {children}
    </TextEffect>
  );
}