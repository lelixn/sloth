"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Open Source", href: "#open-source" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 py-3 shadow-xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-mono font-bold text-lg text-white hover:text-emerald-400 transition-colors tracking-wider"
        >
          <span className="text-xl">🦥</span>
          <span>SLOTH</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            v0.0.1
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-mono text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={SITE_CONFIG.urls.gitHubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <a
            href={SITE_CONFIG.urls.vsCodeMarketplace}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-mono font-semibold tracking-wide text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-95"
          >
            Install Extension
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/95 border-b border-zinc-800 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-mono text-zinc-300 hover:text-emerald-400 py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-3">
            <a
              href={SITE_CONFIG.urls.gitHubRepo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-mono text-zinc-400 hover:text-white"
            >
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={SITE_CONFIG.urls.vsCodeMarketplace}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center px-4 py-2.5 text-xs font-mono font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 rounded"
            >
              Install Extension
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
