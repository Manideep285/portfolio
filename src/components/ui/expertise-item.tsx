"use client"

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Pointer } from "./custom-cursor";

interface ExpertiseItemProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function ExpertiseItem({ Icon, title, description, index }: ExpertiseItemProps) {
  return (
    <Pointer name={title}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
          ease: [0.23, 1, 0.32, 1]
        }}
        whileHover={{ 
          y: -8,
          scale: 1.02,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all"
        style={{ cursor: "none" }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
        >
          <Icon className="w-12 h-12 text-blue-500 mb-4" />
        </motion.div>
        <motion.h3 
          className="text-xl font-semibold mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
        >
          {description}
        </motion.p>
      </motion.div>
    </Pointer>
  );
}