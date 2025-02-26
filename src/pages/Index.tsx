import { motion } from "framer-motion";
import { Code, Database, Brain, Home, User, Briefcase, FileText } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Timeline } from "@/components/Timeline";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { Footerdemo } from "@/components/ui/footer-section";
import { useEffect } from "react";
import { CanvasAnimation } from "@/components/ui/canvas-animation";
import { LoopingText } from "@/components/ui/looping-text";
import { TextEffect } from "@/components/ui/text-effect";
import { Pointer } from "@/components/ui/custom-cursor";
import { SkillsDemo } from "@/components/ui/skills-demo";
import { ExpertiseItem } from "@/components/ui/expertise-item";
import { HandWrittenTitle } from "@/components/ui/hand-written-title";

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "About", url: "#about", icon: User },
  { name: "Projects", url: "#projects", icon: Briefcase },
  { name: "Resume", url: "#resume", icon: FileText },
];

const skills = [
  { name: "Python", color: "bg-gradient-to-r from-blue-600 to-violet-600" },
  { name: "JavaScript", color: "bg-gradient-to-r from-blue-600 to-violet-600" },
  { name: "React", color: "bg-gradient-to-r from-blue-600 to-violet-600" },
  { name: "TypeScript", color: "bg-gradient-to-r from-blue-600 to-violet-600" },
  { name: "Node.js", color: "bg-gradient-to-r from-blue-600 to-violet-600" },
  { name: "SQL", color: "bg-gradient-to-r from-blue-600 to-violet-600" },
  { name: "Git", color: "bg-gradient-to-r from-blue-600 to-violet-600" },
  { name: "Docker", color: "bg-gradient-to-r from-blue-600 to-violet-600" }
];

const Index = () => {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      <NavBar items={navItems} />
      <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-white">
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center px-4 pt-20">
          <CanvasAnimation />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              ease: [0.23, 1, 0.32, 1],
              staggerChildren: 0.2
            }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1]
              }}
              className="mb-6"
            >
              <div className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                <motion.div
                  className="absolute inset-0 blur-2xl bg-gradient-to-r from-blue-500/20 to-violet-500/20"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                    scale: [0.9, 1.1, 0.9],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="flex flex-col items-center space-y-4">
                  <span className="text-sm text-gray-500/70">
                    AI Analyst @ Deccan AI
                  </span>
                  <TextRevealCard
                    text="Manideep Vaddi"
                    revealText="Manideep Vaddi"
                    className="bg-transparent border-none p-0"
                  />
                </div>
              </div>
            </motion.div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Passionate about creating innovative solutions through code and data analysis.
              Currently working at Deccan AI, Hyderabad.
            </p>
          </motion.div>
        </section>

        {/* Skills Section */}
        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
              Skills & Expertise
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ExpertiseItem
                Icon={Code}
                title="Software Development"
                description="Building robust and scalable applications with modern technologies."
                index={0}
              />
              <ExpertiseItem
                Icon={Database}
                title="Data Analysis"
                description="Transforming raw data into meaningful insights and solutions."
                index={1}
              />
              <ExpertiseItem
                Icon={Brain}
                title="Artificial Intelligence"
                description="Implementing AI solutions to solve complex business problems."
                index={2}
              />
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="projects" className="py-20 bg-gradient-to-b from-[#f8f9fa] to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
              Professional Journey
            </h2>
            <Timeline />
          </div>
        </section>

        {/* Resume Section */}
        <section id="resume" className="py-20 relative min-h-[600px] overflow-hidden">
          <div className="container mx-auto px-4 h-full relative z-10">
            <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
              Resume
            </h2>
            <div className="max-w-4xl mx-auto relative">
              {/* Static sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Pointer name="Education">
                  <motion.div
                    className="bg-white text-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                      Education
                    </h3>
                    <p className="text-lg mb-2">Bachelor of Technology (2023)</p>
                    <p className="text-base text-gray-600">Electrical and Electronics Engineering</p>
                  </motion.div>
                </Pointer>
                <Pointer name="Experience">
                  <motion.div
                    className="bg-white text-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                      Experience
                    </h3>
                    <p className="text-lg mb-2">AI Analyst @ Deccan AI</p>
                    <p className="text-base text-gray-600">2024 - Present</p>
                  </motion.div>
                </Pointer>
              </div>

              {/* Skills Demo Section */}
              <SkillsDemo skills={skills} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footerdemo />
      </div>
    </>
  );
};

export default Index;
