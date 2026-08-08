import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TerminalDemo } from "@/components/ui/TerminalDemo";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { OpenSource } from "@/components/OpenSource";
import { Installation } from "@/components/Installation";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-400 selection:text-zinc-950">
      {/* 1. Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Interactive Terminal Demo Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2">
              // INTERACTIVE DEMO
            </span>
            <h2 className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-tight">
              Watch Sloth commit in real-time.
            </h2>
          </div>
          <TerminalDemo />
        </section>

        {/* 4. Features Section */}
        <Features />

        {/* 5. How It Works Section */}
        <HowItWorks />

        {/* 6. Open Source Section */}
        <OpenSource />

        {/* 7. Installation Section */}
        <Installation />

        {/* 8. Final CTA Section */}
        <FinalCTA />
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}
