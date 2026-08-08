"use client";

import React from "react";
import { ArrowUpRight, GitPullRequest, Code, Terminal } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { CopyButton } from "@/components/ui/CopyButton";

export function OpenSource() {
  const cloneSnippet = `$ ${SITE_CONFIG.cloneCommand}
$ cd sloth
$ npm install
$ npm run dev
Ready to contribute.`;

  return (
    <section
      id="open-source"
      className="py-24 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border-t border-b border-zinc-800 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-4">
              // COMMUNITY & TRANSPARENCY
            </span>

            <h2 className="text-3xl sm:text-5xl font-mono font-extrabold text-white tracking-tight mb-6 leading-tight">
              Built in public. <br />
              <span className="text-emerald-400">Open by default.</span>
            </h2>

            <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed mb-8">
              Sloth is an open-source developer tool. Inspect the code, report issues, contribute features, or build on top of it.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={SITE_CONFIG.urls.gitHubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-mono font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded border border-emerald-300 transition-colors"
              >
                <Code className="w-4 h-4" />
                <span>View Source</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={SITE_CONFIG.urls.gitHubContributing}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-mono font-semibold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 rounded border border-zinc-700 transition-colors"
              >
                <GitPullRequest className="w-4 h-4 text-emerald-400" />
                <span>Contribute</span>
              </a>
            </div>
          </div>

          {/* Right Contribution Code Box */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/90 shadow-2xl p-6 font-mono text-xs text-zinc-300 relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4 select-none">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-400">contribute.sh</span>
              </div>
              <CopyButton textToCopy={SITE_CONFIG.cloneCommand} label="COPY CLONE CMD" />
            </div>

            <pre className="space-y-2 leading-relaxed text-emerald-300 whitespace-pre-wrap">
              <span className="text-zinc-500"># Clone the repository</span>
              {"\n"}$ {SITE_CONFIG.cloneCommand}
              {"\n\n"}<span className="text-zinc-500"># Navigate to workspace</span>
              {"\n"}$ cd sloth
              {"\n\n"}<span className="text-zinc-500"># Install dependencies</span>
              {"\n"}$ npm install
              {"\n\n"}<span className="text-zinc-500"># Start extension development</span>
              {"\n"}$ npm run watch
              {"\n\n"}
              <span className="text-emerald-400 font-bold">Ready to contribute. 🦥</span>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
