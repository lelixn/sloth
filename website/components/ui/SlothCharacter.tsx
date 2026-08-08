"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface SlothCharacterProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SlothCharacter({ size = "md", className = "" }: SlothCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [pupilOffset, setPupilOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion) {
      setPupilOffset({ x: 0, y: 0 });
      return;
    }

    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const maxDistance = 300;
      const factor = Math.min(distance / maxDistance, 1);

      const angle = Math.atan2(deltaY, deltaX);
      const maxEyeMove = 4; // Max pupil shift in px

      targetX = Math.cos(angle) * maxEyeMove * factor;
      targetY = Math.sin(angle) * maxEyeMove * factor;
    };

    const updatePosition = () => {
      // Smooth interpolation (lerp)
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      setPupilOffset({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-36 h-36",
    lg: "w-52 h-52"
  }[size];

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      aria-label="Interactive 2D Sloth Mascot"
    >
      {/* 2D Vector Sloth Artwork */}
      <div
        className={`relative ${sizeClasses} ${
          !prefersReducedMotion ? "animate-sloth-breath" : ""
        }`}
      >
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_15px_rgba(34,197,94,0.15)]"
        >
          {/* Branch / Perch */}
          <path
            d="M 10 135 Q 80 130 150 135"
            stroke="#27272a"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 20 135 Q 80 131 140 135"
            stroke="#10b981"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Sloth Body */}
          <path
            d="M 45 90 C 45 65 115 65 115 90 C 115 125 45 125 45 90 Z"
            fill="#18181b"
            stroke="#27272a"
            strokeWidth="2"
          />

          {/* Sloth Head Base */}
          <circle cx="80" cy="72" r="38" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />

          {/* Inner Light Face Mask */}
          <path
            d="M 52 70 C 52 50 108 50 108 70 C 108 92 52 92 52 70 Z"
            fill="#27272a"
            stroke="#52525b"
            strokeWidth="1.5"
          />

          {/* Eye Patches (Darker distinctive sloth eye markings) */}
          <ellipse cx="64" cy="68" rx="12" ry="9" fill="#09090b" transform="rotate(-10 64 68)" />
          <ellipse cx="96" cy="68" rx="12" ry="9" fill="#09090b" transform="rotate(10 96 68)" />

          {/* Left Eye White & Pupil */}
          <circle cx="64" cy="68" r="5" fill="#f4f4f5" />
          <circle
            cx={64 + pupilOffset.x}
            cy={68 + pupilOffset.y}
            r="2.5"
            fill="#10b981"
            className={!prefersReducedMotion ? "animate-sloth-blink" : ""}
          />

          {/* Right Eye White & Pupil */}
          <circle cx="96" cy="68" r="5" fill="#f4f4f5" />
          <circle
            cx={96 + pupilOffset.x}
            cy={68 + pupilOffset.y}
            r="2.5"
            fill="#10b981"
            className={!prefersReducedMotion ? "animate-sloth-blink" : ""}
          />

          {/* Sloth Nose & Snout */}
          <ellipse cx="80" cy="76" rx="5" ry="3.5" fill="#10b981" />
          <path
            d="M 76 83 Q 80 86 84 83"
            stroke="#a1a1aa"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Sloth Claws / Paws on Branch */}
          <path d="M 52 124 L 52 133 M 56 124 L 56 133" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
          <path d="M 104 124 L 104 133 M 108 124 L 108 133" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />

          {/* ASCII Monospace Overlay Accent */}
          <text
            x="80"
            y="32"
            textAnchor="middle"
            fill="#71717a"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="2"
          >
            SYS//SLOTH
          </text>
        </svg>
      </div>

      {/* ASCII Concept Label */}
      <pre className="mt-2 text-[10px] font-mono text-emerald-400/70 tracking-widest leading-none select-none">
        .-&quot;&quot;&quot;&quot;-.
       /  o  o  \
      |    --    |
       \  ----  /
        '------'
      </pre>
    </div>
  );
}
