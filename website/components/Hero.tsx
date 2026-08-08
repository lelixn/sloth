"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Terminal, Download, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { SlothCharacter } from "@/components/ui/SlothCharacter";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const fadeIn = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Subtle Grid & Radial Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Top Tag Label */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono tracking-widest uppercase mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>OPEN SOURCE • VS CODE EXTENSION</span>
        </motion.div>

        {/* 2D Interactive Sloth Character */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-6 flex justify-center"
        >
          <SlothCharacter size="lg" />
        </motion.div>

        {/* Huge Heading */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-mono font-extrabold tracking-tighter text-white leading-none mb-6"
        >
          GIT, <br className="hidden sm:inline" />
          WITHOUT <br />
          <span className="relative inline-block text-emerald-400 border-b-4 border-emerald-500 pb-1 px-2 mt-2 sm:mt-0 bg-emerald-950/50 rounded-sm shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            THE BUSYWORK.
          </span>
        </motion.h1>

        {/* Supporting Paragraph */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-400 font-sans leading-relaxed mb-10"
        >
          {SITE_CONFIG.heroSupportingText}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <a
            href={SITE_CONFIG.urls.vsCodeMarketplace}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-mono font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded border border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Install Extension</span>
          </a>

          <a
            href={SITE_CONFIG.urls.gitHubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-mono font-semibold text-zinc-200 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 rounded border border-zinc-700/80 transition-all hover:border-zinc-500"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>View GitHub</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
          </a>
        </motion.div>

        {/* Sub-text badge */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-xs font-mono text-zinc-500 flex items-center justify-center gap-2 tracking-wider"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Free • Open Source • Built for Developers</span>
        </motion.p>
      </div>
    </section>
  );
}
