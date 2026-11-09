'use client';

import React from 'react';

interface LiquidBackgroundProps {
  className?: string;
  variant?: 'hero' | 'ambient' | 'subtle';
}

export function LiquidBackground({ className = '', variant = 'hero' }: LiquidBackgroundProps) {
  if (variant === 'subtle') {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden -z-10 ${className}`}>
        {/* Soft Liquid Indigo Orb */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full opacity-30 blur-[90px] animate-liquid-1"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(168, 85, 247, 0.15) 60%, transparent 80%)',
          }}
        />
        {/* Soft Liquid Cyan Orb */}
        <div
          className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full opacity-25 blur-[100px] animate-liquid-2"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.15) 60%, transparent 80%)',
          }}
        />
      </div>
    );
  }

  if (variant === 'ambient') {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden -z-10 ${className}`}>
        {/* Ambient Liquid Violet */}
        <div
          className="absolute top-[10%] right-[5%] w-[45vw] h-[45vw] rounded-full opacity-35 blur-[100px] animate-liquid-2"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 75%)',
          }}
        />
        {/* Ambient Liquid Rose Gold */}
        <div
          className="absolute bottom-[5%] left-[5%] w-[40vw] h-[40vw] rounded-full opacity-30 blur-[90px] animate-liquid-3"
          style={{
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.3) 0%, rgba(245, 158, 11, 0.15) 50%, transparent 75%)',
          }}
        />
      </div>
    );
  }

  // Hero variant: Apple Pro Liquid Aurora (Fluid, radiant, and luxurious)
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden -z-10 ${className}`}>
      {/* 1. Deep Liquid Royal Indigo Orb */}
      <div
        className="absolute top-[-15%] left-[10%] w-[55vw] h-[55vw] max-w-[850px] max-h-[850px] rounded-full opacity-45 blur-[100px] animate-liquid-1"
        style={{
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.55) 0%, rgba(124, 58, 237, 0.35) 45%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* 2. Electric Liquid Cyan / Turquoise Orb */}
      <div
        className="absolute top-[25%] right-[-10%] w-[50vw] h-[50vw] max-w-[750px] max-h-[750px] rounded-full opacity-40 blur-[110px] animate-liquid-2"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, rgba(37, 99, 235, 0.25) 50%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* 3. Liquid Sunset Magenta / Rose Orb */}
      <div
        className="absolute bottom-[-15%] left-[25%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full opacity-35 blur-[100px] animate-liquid-3"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.45) 0%, rgba(217, 70, 239, 0.2) 50%, transparent 75%)',
          willChange: 'transform',
        }}
      />

      {/* 4. Warm Solar Amber Highlight */}
      <div
        className="absolute top-[5%] right-[25%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full opacity-25 blur-[90px] animate-liquid-1"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(251, 146, 60, 0.15) 55%, transparent 75%)',
          willChange: 'transform',
        }}
      />

      {/* Apple-style Ultra-Frosted Diffusion Layer */}
      <div className="absolute inset-0 backdrop-blur-[70px] bg-black/25" />
    </div>
  );
}
