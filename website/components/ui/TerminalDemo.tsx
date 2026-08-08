"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, Check, Terminal } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface TerminalLine {
  id: number;
  type: "command" | "status" | "success" | "box" | "empty";
  text: string;
  delay: number; // Delay in ms before showing line
}

const TERMINAL_SEQUENCE: TerminalLine[] = [
  { id: 1, type: "command", text: "$ sloth commit", delay: 300 },
  { id: 2, type: "empty", text: "", delay: 200 },
  { id: 3, type: "status", text: "> scanning repository...", delay: 400 },
  { id: 4, type: "success", text: "✓ 4 files changed", delay: 500 },
  { id: 5, type: "empty", text: "", delay: 200 },
  { id: 6, type: "status", text: "> analyzing changes...", delay: 400 },
  { id: 7, type: "success", text: "✓ auth/login.ts", delay: 150 },
  { id: 8, type: "success", text: "✓ auth/token.ts", delay: 150 },
  { id: 9, type: "success", text: "✓ api/user.ts", delay: 150 },
  { id: 10, type: "success", text: "✓ tests/auth.test.ts", delay: 150 },
  { id: 11, type: "empty", text: "", delay: 200 },
  { id: 12, type: "status", text: "> generating commit message...", delay: 500 },
  { id: 13, type: "empty", text: "", delay: 200 },
  { id: 14, type: "box", text: "┌──────────────────────────────────────────┐", delay: 100 },
  { id: 15, type: "box", text: "│ feat(auth): improve token refresh flow   │", delay: 100 },
  { id: 16, type: "box", text: "└──────────────────────────────────────────┘", delay: 100 },
  { id: 17, type: "empty", text: "", delay: 200 },
  { id: 18, type: "status", text: "> staging changes...", delay: 400 },
  { id: 19, type: "success", text: "✓ git add .", delay: 300 },
  { id: 20, type: "empty", text: "", delay: 200 },
  { id: 21, type: "status", text: "> committing...", delay: 400 },
  { id: 22, type: "success", text: "✓ a83f21c", delay: 300 },
  { id: 23, type: "empty", text: "", delay: 200 },
  { id: 24, type: "success", text: "🦥 committed successfully", delay: 400 }
];

export function TerminalDemo() {
  const prefersReducedMotion = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState<number>(
    prefersReducedMotion ? TERMINAL_SEQUENCE.length : 0
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(!prefersReducedMotion);

  const runAnimationSequence = useCallback(() => {
    if (prefersReducedMotion) {
      setVisibleCount(TERMINAL_SEQUENCE.length);
      setIsPlaying(false);
      return;
    }

    setVisibleCount(0);
    setIsPlaying(true);

    let currentStep = 0;
    const timeouts: NodeJS.Timeout[] = [];

    const scheduleNextLine = () => {
      if (currentStep >= TERMINAL_SEQUENCE.length) {
        setIsPlaying(false);
        return;
      }

      const line = TERMINAL_SEQUENCE[currentStep];
      const timeout = setTimeout(() => {
        currentStep++;
        setVisibleCount(currentStep);
        scheduleNextLine();
      }, line.delay);

      timeouts.push(timeout);
    };

    scheduleNextLine();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const cleanup = runAnimationSequence();
    return () => {
      if (cleanup) cleanup();
    };
  }, [runAnimationSequence]);

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg border border-zinc-800 bg-zinc-950/90 shadow-2xl overflow-hidden font-mono text-sm">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-xs text-zinc-400 font-mono flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            sloth — terminal
          </span>
        </div>

        <button
          onClick={runAnimationSequence}
          disabled={isPlaying}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-emerald-400 bg-zinc-800/60 hover:bg-zinc-800 rounded border border-zinc-700/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Replay Terminal Animation"
        >
          <Play className={`w-3 h-3 ${isPlaying ? "animate-pulse" : ""}`} />
          <span>REPLAY</span>
        </button>
      </div>

      {/* Terminal Body */}
      <div className="p-5 md:p-6 min-h-[440px] text-zinc-300 leading-relaxed overflow-x-auto space-y-1">
        {TERMINAL_SEQUENCE.slice(0, visibleCount).map((line) => {
          if (line.type === "command") {
            return (
              <div key={line.id} className="text-emerald-400 font-bold flex items-center gap-2">
                <span>{line.text}</span>
              </div>
            );
          }
          if (line.type === "status") {
            return (
              <div key={line.id} className="text-zinc-400">
                {line.text}
              </div>
            );
          }
          if (line.type === "success") {
            return (
              <div key={line.id} className="text-emerald-400 pl-2">
                {line.text}
              </div>
            );
          }
          if (line.type === "box") {
            return (
              <div key={line.id} className="text-emerald-300 font-semibold tracking-wide">
                {line.text}
              </div>
            );
          }
          return <div key={line.id} className="h-2" />;
        })}

        {/* Cursor prompt line */}
        <div className="flex items-center gap-2 pt-2 text-emerald-400">
          <span>$</span>
          <span className="w-2.5 h-5 bg-emerald-400 animate-pulse inline-block" />
        </div>
      </div>
    </div>
  );
}
