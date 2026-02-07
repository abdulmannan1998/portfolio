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
          initial={false}
          animate={{ y: [0, -4, 0], scale: [1, 1.01, 1] }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-[15vw] md:text-[12vw] font-black tracking-tighter leading-none text-center"
          style={{
            WebkitTextStroke: "2px rgba(255,255,255,0.3)",
            WebkitTextFillColor: "transparent",
          }}
        >
          MANNAN
        </motion.h1>

        <motion.div
          initial={false}
          animate={{ scaleX: [0.9, 1] }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          className="absolute top-1/2 left-0 right-0 h-1 bg-orange-500 origin-left"
          style={{ originX: 0 }}
        />
      </div>

      <motion.p
        initial={false}
        animate={{ opacity: [0.8, 1], y: [6, 0] }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="mt-8 text-2xl md:text-4xl font-mono text-orange-500 text-center"
      >
        SENIOR SOFTWARE ENGINEER
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={false}
        animate={{ opacity: [0, 1] }}
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
