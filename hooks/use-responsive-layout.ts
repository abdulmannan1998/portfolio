"use client";

import { useState, useEffect } from "react";
import { debounce } from "@/lib/debounce";

export type ViewportSize = {
  width: number;
  height: number;
};

export type ResponsiveLayout = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  viewport: ViewportSize;
};

export function useResponsiveLayout(): ResponsiveLayout {
  // Initialize viewport with actual window dimensions if available
  const [viewport, setViewport] = useState<ViewportSize>(() => {
    if (typeof window !== "undefined") {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1920, height: 1080 };
  });

  useEffect(() => {
    // Skip if window is not available (SSR)
    if (typeof window === "undefined") return;

    // Debounced resize handler
    const handleResize = debounce(() => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 300);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate breakpoint states
  const isMobile = viewport.width < 768;
  const isTablet = viewport.width >= 768 && viewport.width < 1024;
  const isDesktop = viewport.width >= 1024;

  return {
    isMobile,
    isTablet,
    isDesktop,
    viewport,
  };
}
