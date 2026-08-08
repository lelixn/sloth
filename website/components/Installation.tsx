"use client";

import React from "react";
import { Download, Terminal, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { CopyButton } from "@/components/ui/CopyButton";

export function Installation() {
  return (
    <section id="installation" className="py-24 bg-zinc-950 border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-3">
            // INSTALLATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-mono font-extrabold text-white tracking-tight">
            Get Sloth.
          </h2>
        </div>

        {/* 2 Installation Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Method 1: VS Code Marketplace */}
          <div className="p-8 rounded-lg bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  METHOD 01
                </span>
                <span className="text-[11px] font-mono text-zinc-500">GUI</span>
              </div>

              <h3 className="text-xl font-mono font-bold text-white mb-2">
                VS CODE MARKETPLACE
              </h3>

              <p className="text-sm font-sans text-zinc-400 mb-6">
                Search for Sloth in the VS Code extensions tab (`Ctrl+Shift+X`) or click below.
              </p>
            </div>

            <div>
              {!SITE_CONFIG.status.isPublishedToMarketplace ? (
                <div className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-mono font-bold text-amber-300 bg-amber-950/40 border border-amber-500/40 rounded">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{SITE_CONFIG.status.marketplaceStatusLabel}</span>
                </div>
              ) : (
                <a
                  href={SITE_CONFIG.urls.vsCodeMarketplace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-mono font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded border border-emerald-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Install from Marketplace</span>
                </a>
              )}
            </div>
          </div>

          {/* Method 2: Command Line */}
          <div className="p-8 rounded-lg bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  METHOD 02
                </span>
                <span className="text-[11px] font-mono text-zinc-500">CLI</span>
              </div>

              <h3 className="text-xl font-mono font-bold text-white mb-2">
                COMMAND LINE
              </h3>

              <p className="text-sm font-sans text-zinc-400 mb-6">
                Run the quick install command directly in your local terminal.
              </p>
            </div>

            <div>
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800 flex items-center justify-between font-mono text-xs text-emerald-300">
                <div className="flex items-center gap-2 truncate">
                  <Terminal className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <code className="truncate">{SITE_CONFIG.installCommand}</code>
                </div>
                <CopyButton textToCopy={SITE_CONFIG.installCommand} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
