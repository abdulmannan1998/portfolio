"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TwinklingStars } from "@/components/twinkling-stars";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale: heroScale, opacity: heroOpacity }}
      className="sticky top-0 min-h-screen flex flex-col justify-center items-center px-6 bg-black"
    >
      <TwinklingStars />
      {/* Giant name */}
      <div className="relative">
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-[15vw] md:text-[12vw] font-black tracking-tighter leading-none text-center"
          style={{
            WebkitTextStroke: "2px rgba(255,255,255,0.3)",
            WebkitTextFillColor: "transparent",
          }}
        >
          MANNAN
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute top-1/2 left-0 right-0 h-1 bg-orange-500 origin-left"
        />
      </div>

      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-8 text-2xl md:text-4xl font-mono text-orange-500 text-center"
      >
        SENIOR SOFTWARE ENGINEER
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-16 bg-gradient-to-b from-white/50 to-transparent"
        />
      </motion.div>
    </motion.section>
  );
}
