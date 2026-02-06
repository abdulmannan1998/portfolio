"use client";

import { useRef, useEffect, type ReactNode } from "react";

interface HeroParallaxProps {
  children: ReactNode;
}

export function HeroParallax({ children }: HeroParallaxProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.scrollY;
      const maxScroll = window.innerHeight * 0.15;
      const progress = Math.min(scrolled / maxScroll, 1);

      // Scale from 1.0 to 0.8
      const scale = 1 - progress * 0.2;
      // Opacity from 1.0 to 0.0
      const opacity = 1 - progress;

      hero.style.transform = `scale(${scale})`;
      hero.style.opacity = `${opacity}`;

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Set initial state (handles page refreshed mid-scroll)
    updateParallax();

    // Add passive scroll listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="sticky top-0 min-h-screen flex flex-col justify-center items-center px-6 bg-black"
    >
      {children}
    </section>
  );
}
