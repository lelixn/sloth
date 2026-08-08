"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Sloth, Rocket } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface StepItem {
  number: string;
  title: string;
  description: string;
  subText: string;
}

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "CHANGE",
    description: "Edit your code normally inside VS Code.",
    subText: "Sloth automatically tracks modified and untracked workspace files."
  },
  {
    number: "02",
    title: "SLOTH",
    description: "Sloth analyzes your changes and prepares the Git action.",
    subText: "Generates Conventional Commit suggestions using localized rules."
  },
  {
    number: "03",
    title: "SHIP",
    description: "Review, commit and continue building.",
    subText: "Stages changes and creates clean local commits in seconds."
  }
];

export function HowItWorks() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="how-it-works" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-3">
            // WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-5xl font-mono font-extrabold text-white tracking-tight">
            Three steps. That&apos;s it.
          </h2>
        </div>

        {/* Timeline Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Animated Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/20 via-emerald-500/80 to-emerald-500/20 -translate-y-8 z-0 pointer-events-none" />

          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative z-10 p-6 sm:p-8 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/40 transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-mono font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded">
                    {step.number}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                    STEP // {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-mono font-bold text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-sm font-sans font-medium text-zinc-200 leading-relaxed mb-4">
                  {step.description}
                </p>
              </div>

              <p className="text-xs font-sans text-zinc-400 border-t border-zinc-800/80 pt-4 leading-normal">
                {step.subText}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
