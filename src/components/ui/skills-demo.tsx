"use client"

import { motion } from "framer-motion"
import { Pointer } from "./custom-cursor"

interface Skill {
  name: string;
  color?: string;
}

interface SkillsDemoProps {
  skills: Skill[];
}

export function SkillsDemo({ skills }: SkillsDemoProps) {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-white border border-gray-100 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-white to-gray-50/50" />
      <div className="relative z-[1] h-full w-full p-8">
        <h3 className="text-2xl font-semibold text-center mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
            Skills & Technologies
          </span>
        </h3>
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {skills.map((skill, index) => (
            <Pointer key={skill.name} name={skill.name}>
              <motion.div
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05,
                  ease: [0.23, 1, 0.32, 1]
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.15, ease: "easeOut" }
                }}
                whileTap={{ 
                  scale: 0.98,
                  transition: { duration: 0.1 }
                }}
                style={{ cursor: "none" }}
              >
                <div className="relative bg-white rounded-lg p-4 shadow-lg text-center overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-violet-600/5 rounded-lg"
                    whileHover={{ 
                      opacity: [null, 1],
                      scale: [null, 1.2],
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                  />
                  <motion.span
                    className="relative z-10 block font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600"
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.15 }
                    }}
                  >
                    {skill.name}
                  </motion.span>
                </div>
              </motion.div>
            </Pointer>
          ))}
        </motion.div>
      </div>
      <div className="absolute bottom-0 right-0 h-full w-3/4 rounded-full bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-blue-500/5 blur-3xl" />
    </div>
  );
}
