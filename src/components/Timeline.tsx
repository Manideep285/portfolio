
"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { BadgeCheck, Calendar, GraduationCap, Briefcase } from "lucide-react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const timelineData: TimelineEntry[] = [
  {
    title: "Present",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Currently working on advanced AI projects at Deccan AI, specializing in fine-tuning language models.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-white shadow-lg">
            <Briefcase className="w-8 h-8 text-blue-500 mb-4" />
            <h4 className="font-semibold mb-2">Current Projects</h4>
            <p className="text-sm text-gray-600">Leading RLHF and SFT implementations for enhanced model performance</p>
          </div>
          <div className="p-6 rounded-xl bg-white shadow-lg">
            <BadgeCheck className="w-8 h-8 text-blue-500 mb-4" />
            <h4 className="font-semibold mb-2">Active Skills</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">Python</span>
              <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">SQL</span>
              <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">PowerBI</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2024",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Joined Deccan AI as an AI Analyst, marking the beginning of my professional career in artificial intelligence.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-6 rounded-xl bg-white shadow-lg">
            <Briefcase className="w-8 h-8 text-blue-500 mb-4" />
            <h4 className="font-semibold mb-2">Career Start</h4>
            <p className="text-sm text-gray-600">Transitioned from academic projects to professional AI development</p>
          </div>
          <div className="p-6 rounded-xl bg-white shadow-lg">
            <BadgeCheck className="w-8 h-8 text-blue-500 mb-4" />
            <h4 className="font-semibold mb-2">Initial Role</h4>
            <p className="text-sm text-gray-600">Started as AI Analyst focusing on model development and data analysis</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "2023",
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
          Successfully completed Bachelor's degree in Technology with a focus on Electrical and Electronics Engineering.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-white shadow-lg">
            <GraduationCap className="w-8 h-8 text-blue-500 mb-4" />
            <h4 className="font-semibold mb-2">B.Tech Graduation</h4>
            <p className="text-sm text-gray-600">Major in Electrical and Electronics Engineering</p>
          </div>
          <div className="p-6 rounded-xl bg-white shadow-lg">
            <Calendar className="w-8 h-8 text-blue-500 mb-4" />
            <h4 className="font-semibold mb-2">Academic Projects</h4>
            <p className="text-sm text-gray-600">Completed various projects in Data Science and Software Development</p>
          </div>
        </div>
      </div>
    ),
  }
];

export const Timeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
          My Professional Journey
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm">
          A timeline of my career progression and key achievements
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {timelineData.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-blue-500 border border-blue-300 dark:border-blue-700" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-blue-500 dark:text-blue-400">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-blue-500 dark:text-blue-400">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-blue-200 dark:via-blue-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-blue-500 via-blue-400 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
