"use client";

import React from "react";
import { Download, Star, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { SlothCharacter } from "@/components/ui/SlothCharacter";

export function FinalCTA() {
  return (
    <section className="py-24 bg-gradient-to-b from-zinc-950 via-zinc-900/80 to-zinc-950 border-t border-zinc-800 text-center relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Sloth Character */}
        <div className="mb-6 flex justify-center">
          <SlothCharacter size="md" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-mono font-extrabold text-white tracking-tight mb-4">
          Stop typing the same Git commands.
        </h2>

        {/* Subtext */}
        <p className="text-lg sm:text-xl font-mono text-emerald-400 mb-10">
          Let the sloth handle it. 🦥
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={SITE_CONFIG.urls.vsCodeMarketplace}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-mono font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded border border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Install for VS Code</span>
          </a>

          <a
            href={SITE_CONFIG.urls.gitHubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-mono font-semibold text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-700 transition-colors"
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Star on GitHub</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
