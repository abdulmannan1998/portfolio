"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Heart, ExternalLink } from "lucide-react";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 px-6 md:px-12 lg:px-24 border-t border-stone-800/50">
      <div className="absolute inset-0 bg-stone-950" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-bold text-white text-lg">
                M
              </div>
              <div>
                <span className="text-white font-semibold">Mannan</span>
                <span className="text-stone-500">.dev</span>
              </div>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">
              Senior Software Engineer building production-grade interfaces that
              turn complex data into intuitive experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-stone-500 hover:text-white transition-colors text-sm"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#stack"
                  className="text-stone-500 hover:text-white transition-colors text-sm"
                >
                  Tech Stack
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  className="text-stone-500 hover:text-white transition-colors text-sm"
                >
                  Experience
                </a>
              </li>
              <li>
                <a
                  href="#graph"
                  className="text-stone-500 hover:text-white transition-colors text-sm"
                >
                  Career Graph
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/sunnyimmortal"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stone-500 hover:text-white transition-colors text-sm"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
                <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
              </a>
              <a
                href="https://linkedin.com/in/mannanabdul"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stone-500 hover:text-blue-400 transition-colors text-sm"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
                <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
              </a>
              <a
                href="mailto:abdul.1998.17@gmail.com"
                className="flex items-center gap-2 text-stone-500 hover:text-orange-400 transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>abdul.1998.17@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-600 text-sm">
            &copy; {currentYear} Mannan Abdul. All rights reserved.
          </p>

          <div className="flex items-center gap-1 text-stone-600 text-sm">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>using</span>
            <span className="text-stone-500">Next.js</span>
            <span>&</span>
            <span className="text-stone-500">React Flow</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
