'use client';

import React from 'react';
import Link from 'next/link';

interface ElevareLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  href?: string;
}

export function ElevareLogo({
  className = '',
  size = 'md',
  showWordmark = true,
  href = '/',
}: ElevareLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }[size];

  const textSizes = {
    sm: 'text-base tracking-[0.22em]',
    md: 'text-lg sm:text-xl tracking-[0.25em]',
    lg: 'text-2xl sm:text-3xl tracking-[0.28em]',
    xl: 'text-4xl tracking-[0.3em]',
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-3 select-none group cursor-pointer ${className}`}>
      {/* Sculpted Monogram Mark */}
      <div className={`relative ${iconSizes} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_16px_rgba(99,102,241,0.35)]"
        >
          <defs>
            <linearGradient id="logoLiquid" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF" />
              <stop offset="30%" stop-color="#F1F5F9" />
              <stop offset="60%" stop-color="#38BDF8" />
              <stop offset="100%" stop-color="#818CF8" />
            </linearGradient>

            <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#181B26" />
              <stop offset="60%" stop-color="#0A0C13" />
              <stop offset="100%" stop-color="#040508" />
            </linearGradient>

            <linearGradient id="logoBorder" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="rgba(255, 255, 255, 0.4)" />
              <stop offset="50%" stop-color="rgba(56, 189, 248, 0.35)" />
              <stop offset="100%" stop-color="rgba(129, 140, 248, 0.2)" />
            </linearGradient>
          </defs>

          {/* Obsidian Squircle Tile */}
          <rect
            width="512"
            height="512"
            rx="118"
            fill="url(#logoBg)"
            stroke="url(#logoBorder)"
            strokeWidth="10"
          />

          {/* Ambient Liquid Back-Glow */}
          <circle cx="256" cy="256" r="130" fill="#6366F1" opacity="0.25" />
          <circle cx="280" cy="220" r="85" fill="#38BDF8" opacity="0.22" />

          {/* Architectural Elevation Monogram "E" */}
          <g>
            {/* Top Chevron Apex */}
            <path
              d="M 256,122 L 388,234 L 336,274 L 256,204 L 176,274 L 124,234 Z"
              fill="url(#logoLiquid)"
            />
            {/* Middle Horizon Bar */}
            <path
              d="M 174,296 L 338,296 L 314,334 L 198,334 Z"
              fill="url(#logoLiquid)"
            />
            {/* Base Architectural Pedestal */}
            <path
              d="M 136,356 L 376,356 L 350,396 L 162,396 Z"
              fill="url(#logoLiquid)"
            />
          </g>
        </svg>
      </div>

      {/* Styled Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-black text-white uppercase font-sans leading-none ${textSizes} transition-opacity group-hover:opacity-90`}>
            ELEVARE
          </span>
          <span className="text-[8px] uppercase tracking-[0.35em] text-cyan-400 font-semibold mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
            ATELIER
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
