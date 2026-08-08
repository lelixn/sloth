"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
  className?: string;
  label?: string;
}

export function CopyButton({ textToCopy, className = "", label }: CopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API fails
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border transition-all ${
        copied
          ? "border-emerald-500 bg-emerald-950/40 text-emerald-400"
          : "border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:text-white hover:border-zinc-500"
      } ${className}`}
      aria-label="Copy snippet"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? "COPIED" : label || "COPY"}</span>
    </button>
  );
}
