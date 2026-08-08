"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, GitBranch, Cpu } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface FeatureItem {
  id: string;
  codeTag: string;
  title: string;
  description: string;
  snippet: React.ReactNode;
  icon: React.ReactNode;
}

const FEATURES_DATA: FeatureItem[] = [
  {
    id: "smart-commits",
    codeTag: "SYS/01",
    title: "SMART COMMITS",
    description:
      "Generate meaningful conventional commit messages directly from analyzed workspace changes.",
    icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
    snippet: (
      <div className="font-mono text-xs bg-zinc-900/90 p-3 rounded border border-zinc-800 text-emerald-300 font-semibold select-none">
        feat(auth): improve token refresh flow
      </div>
    )
  },
  {
    id: "one-click-workflow",
    codeTag: "WORKFLOW",
    title: "ONE-CLICK WORKFLOW",
    description:
      "Stage, edit messages, and commit changes cleanly without switching contexts or opening external GUIs.",
    icon: <Zap className="w-5 h-5 text-emerald-400" />,
    snippet: (
      <div className="font-mono text-xs bg-zinc-900/90 p-3 rounded border border-zinc-800 flex items-center justify-between text-zinc-300 select-none">
        <span>Changes</span>
        <span className="text-emerald-500">→</span>
        <span>Stage</span>
        <span className="text-emerald-500">→</span>
        <span className="text-emerald-400 font-bold">Commit</span>
      </div>
    )
  },
  {
    id: "git-status",
    codeTag: "GIT/CORE",
    title: "GIT STATUS",
    description:
      "See your current repository branch, staged count, and working tree state directly inside VS Code output.",
    icon: <GitBranch className="w-5 h-5 text-emerald-400" />,
    snippet: (
      <div className="font-mono text-xs bg-zinc-900/90 p-3 rounded border border-zinc-800 flex items-center justify-around text-zinc-400 select-none">
        <span className="text-white font-bold">main</span>
        <span className="text-amber-400">2 modified</span>
        <span className="text-emerald-400">1 staged</span>
      </div>
    )
  },
  {
    id: "developer-first",
    codeTag: "DEV/NATIVE",
    title: "DEVELOPER FIRST",
    description:
      "Fast, local, zero-telemetry tool built to integrate seamlessly with the developer ecosystem.",
    icon: <Cpu className="w-5 h-5 text-emerald-400" />,
    snippet: (
      <div className="font-mono text-xs bg-zinc-900/90 p-3 rounded border border-zinc-800 flex items-center justify-around text-zinc-300 select-none">
        <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">VS Code</span>
        <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">TypeScript</span>
        <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-emerald-400">Git</span>
      </div>
    )
  }
];

export function Features() {
  const prefersReducedMotion = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.1 }
    })
  };

  return (
    <section id="features" className="py-24 bg-zinc-950 border-t border-b border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-3">
            // CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-mono font-extrabold text-white tracking-tight">
            Git tasks. Less typing.
          </h2>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES_DATA.map((feature, idx) => (
            <motion.div
              key={feature.id}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              className="group relative p-6 sm:p-8 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Header Label */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded bg-zinc-800/80 border border-zinc-700/60">
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 tracking-wider">
                    {feature.codeTag}
                  </span>
                </div>

                <h3 className="text-xl font-mono font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-sans">
                  {feature.description}
                </p>
              </div>

              {/* Technical Code Snippet */}
              {feature.snippet}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
