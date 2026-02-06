"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Beaker,
  Menu,
  X,
  Mail,
} from "lucide-react";
import Link from "next/link";

type NavigationProps = {
  variant?: "default" | "creative";
};

export function Navigation({ variant = "default" }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#stack", label: "Stack" },
    { href: "#experience", label: "Experience" },
    { href: "#graph", label: "Graph" },
    { href: "/creative", label: "Creative", isExternal: true },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-stone-950/90 backdrop-blur-lg border-b border-stone-800/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo / Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-bold text-white text-lg">
                  M
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-stone-950" />
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-semibold">Mannan</span>
                <span className="text-stone-500">.dev</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.isExternal ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-orange-400/80 hover:text-orange-400 transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                )
              )}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {/* Labs Button */}
              <Link
                href="/labs"
                className="group relative flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-stone-700 text-stone-400 hover:border-purple-500/50 hover:text-purple-400 transition-all"
              >
                <Beaker className="h-4 w-4" />
                <span className="text-sm font-medium">Labs</span>
                <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  SOON
                </span>
              </Link>

              {/* Social Links */}
              <a
                href="https://github.com/sunnyimmortal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition-all"
              >
                <Github className="h-5 w-5" />
              </a>

              <a
                href="https://linkedin.com/in/mannanabdul"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 hover:text-blue-400 hover:border-blue-500/30 transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </a>

              {/* Contact CTA */}
              <a
                href="mailto:abdul.1998.17@gmail.com"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-stone-900 border border-stone-800 text-stone-400"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-stone-950 border-b border-stone-800"
            >
              <div className="px-6 py-6 space-y-4">
                {navLinks.map((link) =>
                  link.isExternal ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg text-stone-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  )
                )}

                <div className="pt-4 border-t border-stone-800 space-y-3">
                  <Link
                    href="/labs"
                    className="flex items-center gap-2 text-purple-400"
                  >
                    <Beaker className="h-4 w-4" />
                    <span>Labs</span>
                    <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded">
                      Coming Soon
                    </span>
                  </Link>

                  <div className="flex items-center gap-3">
                    <a
                      href="https://github.com/sunnyimmortal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-stone-400"
                    >
                      <Github className="h-5 w-5" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href="https://linkedin.com/in/mannanabdul"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-stone-400"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn</span>
                    </a>
                  </div>

                  <a
                    href="mailto:abdul.1998.17@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-medium"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact Me</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed nav */}
      <div className="h-16 md:h-20" />
    </>
  );
}
