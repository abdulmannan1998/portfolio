"use client";

import { useState, useEffect } from "react";

export type AnimatedCounterProps = {
  value: string;
  suffix?: string;
};

export function AnimatedCounter({ value, suffix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/\D/g, "")) || 0;

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [numericValue]);

  return (
    <span>
      {value.startsWith("+") ? "+" : value.startsWith("-") ? "-" : ""}
      {count}
      {suffix}
    </span>
  );
}
