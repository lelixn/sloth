"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  const links = [
    { label: "GitHub", href: SITE_CONFIG.urls.gitHubRepo, external: true },
    { label: "VS Code", href: SITE_CONFIG.urls.vsCodeMarketplace, external: true },
    { label: "Issues", href: SITE_CONFIG.urls.gitHubIssues, external: true },
    { label: "Contributing", href: SITE_CONFIG.urls.gitHubContributing, external: true },
    { label: "License", href: SITE_CONFIG.urls.license, external: true }
  ];

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12 text-zinc-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-base text-white hover:text-emerald-400 transition-colors"
          >
            <span className="text-lg">🦥</span>
            <span>SLOTH</span>
          </Link>
          <span className="text-zinc-500">{SITE_CONFIG.tagline}</span>
        </div>

        {/* Center/Right Links */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <span>{link.label}</span>
              {link.external && <ArrowUpRight className="w-3 h-3 text-zinc-500" />}
            </a>
          ))}
        </div>

        {/* Bottom Right License */}
        <div className="text-zinc-500">
          <span>{SITE_CONFIG.licenseText}</span>
        </div>
      </div>
    </footer>
  );
}
