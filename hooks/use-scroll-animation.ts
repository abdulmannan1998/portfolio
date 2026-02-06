"use client";

import { useEffect, type RefObject } from "react";

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * React hook that provides Intersection Observer polyfill for scroll-driven animations
 * in browsers that don't support animation-timeline: view()
 *
 * In browsers with native support, this hook does nothing (CSS handles everything).
 * In browsers without support, it uses Intersection Observer to add 'animate' class
 * which triggers the CSS animation via animation-play-state: running.
 *
 * @param ref - React ref to the element that should animate on scroll
 * @param options - Configuration for intersection behavior
 * @param options.threshold - Percentage of element visibility to trigger (0-1), default 0.1
 * @param options.rootMargin - Margin around root viewport, default '0px 0px -10% 0px'
 * @param options.once - If true, animation triggers once and doesn't reverse, default true
 */
export function useScrollAnimation(
  ref: RefObject<HTMLElement | null>,
  options?: ScrollAnimationOptions,
) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -10% 0px",
    once = true,
  } = options || {};

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Feature detection - skip polyfill if native support exists
    if (
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline: view()")
    ) {
      return;
    }

    // Create Intersection Observer for polyfill
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add 'animate' class to trigger CSS animation
            entry.target.classList.add("animate");

            // Optionally disconnect after first trigger
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            // Remove class to allow re-triggering when element scrolls back into view
            entry.target.classList.remove("animate");
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, once]);
}

/**
 * Standalone (non-hook) function that initializes scroll animations for all elements
 * with animation classes (.fade-in-up, .fade-in-down, .fade-in-left, .scale-in)
 *
 * Useful for initializing animations at layout/root level without needing React refs.
 * Can be called once from a client component that wraps the entire app.
 *
 * @param options - Configuration for intersection behavior
 * @returns Cleanup function that disconnects the observer
 */
export function initScrollAnimations(
  options?: ScrollAnimationOptions,
): () => void {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -10% 0px",
    once = true,
  } = options || {};

  // Feature detection - skip polyfill if native support exists
  if (
    typeof CSS !== "undefined" &&
    CSS.supports("animation-timeline: view()")
  ) {
    return () => {}; // No-op cleanup
  }

  // Find all elements with animation classes
  const animatedElements = document.querySelectorAll(
    ".fade-in-up, .fade-in-down, .fade-in-left, .scale-in",
  );

  if (animatedElements.length === 0) {
    return () => {}; // No-op cleanup
  }

  // Create single observer for all animated elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");

          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove("animate");
        }
      });
    },
    { threshold, rootMargin },
  );

  // Observe all animated elements
  animatedElements.forEach((element) => {
    observer.observe(element);
  });

  // Return cleanup function
  return () => {
    observer.disconnect();
  };
}
