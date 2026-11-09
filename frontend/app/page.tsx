'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { LiquidBackground } from '@/components/ui/LiquidBackground';
import { useFeaturedProducts, useProducts } from '@/hooks/useProducts';

const categories = [
  {
    name: 'Men',
    slug: 'men',
    subtitle: 'Tailored Essentials & Sculpted Outerwear',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    itemCount: '18 Pieces',
    accent: 'from-indigo-500/20 to-transparent',
  },
  {
    name: 'Women',
    slug: 'women',
    subtitle: 'Architectural Silhouettes & Drapes',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    itemCount: '24 Pieces',
    accent: 'from-rose-500/20 to-transparent',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    subtitle: 'Italian Leather & Minimal Accents',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    itemCount: '12 Pieces',
    accent: 'from-cyan-500/20 to-transparent',
  },
];

const pillars = [
  {
    icon: Truck,
    title: 'Complimentary Express Shipping',
    desc: 'Worldwide door-to-door delivery on orders over $100 with carbon-neutral transit.',
    glow: 'from-indigo-500 to-blue-500',
  },
  {
    icon: ShieldCheck,
    title: 'Sustainable Atelier Craft',
    desc: 'Certified organic Japanese cotton, Italian wool, and ethically tanned hides.',
    glow: 'from-cyan-500 to-emerald-500',
  },
  {
    icon: RotateCcw,
    title: '30-Day Effortless Returns',
    desc: 'Pre-paid complimentary return courier arranged directly from your residence.',
    glow: 'from-purple-500 to-pink-500',
  },
  {
    icon: Clock,
    title: 'Dedicated Client Concierge',
    desc: 'Bespoke sizing recommendations and personal styling guidance 24/7.',
    glow: 'from-amber-500 to-rose-500',
  },
];

export default function HomePage() {
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: newArrivalsData, isLoading: newLoading } = useProducts({ sort: 'newest', limit: 4 });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  return (
    <div className="relative overflow-x-hidden bg-[#090a0f] text-slate-100">
      {/* 1. Infinite Luxury Marquee Ticker */}
      <div className="bg-[#0c0d15]/90 backdrop-blur-md text-neutral-300 text-[11px] font-medium uppercase tracking-[0.25em] py-2.5 overflow-hidden border-b border-white/[0.08] select-none">
        <div className="flex w-[200%] animate-marquee">
          <div className="flex shrink-0 items-center justify-around w-full gap-8">
            <span className="text-cyan-300">✨ Complimentary Express Delivery Worldwide Over $100</span>
            <span className="text-neutral-600">•</span>
            <span className="text-white">ELEVARE ATELIER SS26 READY-TO-WEAR</span>
            <span className="text-neutral-600">•</span>
            <span className="text-indigo-300">ELEVATE YOUR EVERYDAY AESTHETIC</span>
            <span className="text-neutral-600">•</span>
            <span>SUSTAINABLY SOURCED LUXURY FABRICS</span>
            <span className="text-neutral-600">•</span>
            <span>30-DAY HASSLE-FREE RETURNS</span>
            <span className="text-neutral-600">•</span>
          </div>
          <div className="flex shrink-0 items-center justify-around w-full gap-8">
            <span className="text-cyan-300">✨ Complimentary Express Delivery Worldwide Over $100</span>
            <span className="text-neutral-600">•</span>
            <span className="text-white">ELEVARE ATELIER SS26 READY-TO-WEAR</span>
            <span className="text-neutral-600">•</span>
            <span className="text-indigo-300">ELEVATE YOUR EVERYDAY AESTHETIC</span>
            <span className="text-neutral-600">•</span>
            <span>SUSTAINABLY SOURCED LUXURY FABRICS</span>
            <span className="text-neutral-600">•</span>
            <span>30-DAY HASSLE-FREE RETURNS</span>
            <span className="text-neutral-600">•</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section with Apple Liquid Aurora & Cinematic Ken Burns */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Apple Style Fluid Liquid Mesh Background */}
        <LiquidBackground variant="hero" />

        {/* Cinematic Backdrop Image with Ken Burns Zoom */}
        <div className="absolute inset-0 overflow-hidden -z-20">
          <Image
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2000&q=85"
            alt="ELEVARE Editorial Collection"
            fill
            priority
            className="object-cover object-center animate-kenburns opacity-35 scale-100"
          />
          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090a0f]/80 via-transparent to-[#090a0f]" />
        </div>

        {/* Hero Interactive Center Stage */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <ScrollReveal direction="down" delay={50}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/20 text-[11px] font-semibold tracking-[0.25em] uppercase mb-8 text-neutral-200 shadow-[0_0_25px_rgba(99,102,241,0.25)]">
              <Sparkles size={13} className="text-cyan-300 animate-pulse" />
              <span>Spring / Summer 2026 Atelier</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={150}>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-6 leading-[0.92] uppercase font-sans">
              <span className="liquid-text-silver block">Elevate Your</span>
              <span className="font-serif italic font-normal tracking-normal lowercase text-4xl sm:text-6xl md:text-7xl text-indigo-200 block mt-1">
                everyday aesthetic.
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={250}>
            <p className="text-base sm:text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Where architectural minimalism meets timeless luxury craftsmanship. Conscious essentials sculpted to command quiet authority.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={350}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-black hover:bg-neutral-100 px-8 py-4 font-bold tracking-wider uppercase text-xs rounded-full shadow-[0_0_35px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Explore Catalog
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/products?featured=true" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto border border-white/20 text-white bg-white/[0.06] backdrop-blur-xl hover:bg-white/[0.12] hover:border-white/40 px-8 py-4 font-semibold tracking-wider uppercase text-xs rounded-full hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Compass size={15} className="text-indigo-400" />
                  View Lookbook
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Apple-style floating scroll mouse cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">Scroll</span>
          <div className="w-4 h-7 rounded-full border border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-gradient-to-b from-white to-cyan-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* 3. Luxury Pillars with Apple Frosted Glass Cards */}
      <section className="relative py-16 border-y border-white/[0.08] bg-[#0c0e17]/60 backdrop-blur-xl">
        <LiquidBackground variant="subtle" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <ScrollReveal key={pillar.title} delay={idx * 80} direction="up">
                  <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group">
                    <div className="p-3 rounded-xl bg-white/[0.06] border border-white/10 w-fit text-white group-hover:scale-110 transition-transform">
                      <Icon size={20} className="text-cyan-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1.5 tracking-wide">{pillar.title}</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed font-light">{pillar.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Featured Highlights with Liquid Glow */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <LiquidBackground variant="ambient" />
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-indigo-400 font-bold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                Curated Edits
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                Featured Highlights
              </h2>
            </div>
            <Link
              href="/products?featured=true"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-300 hover:text-white font-semibold border-b border-white/30 pb-1 hover:border-white transition-all group"
            >
              Explore Full Collection
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <ProductGrid
            products={featuredData?.products || []}
            isLoading={featuredLoading}
          />
        </ScrollReveal>
      </section>

      {/* 5. Fluid Category Showcase with Dynamic Liquid Cards */}
      <section className="relative py-28 border-y border-white/[0.08] bg-[#0c0d15]/80 overflow-hidden">
        <LiquidBackground variant="hero" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-bold block mb-2">
                Atelier Directory
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-3">
                Shop By Category
              </h2>
              <p className="text-sm text-neutral-400 font-light">
                Discover pieces crafted from raw selvedge denim, pure virgin wool, and buttery Nappa leather.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <ScrollReveal key={cat.slug} delay={idx * 120} direction="up">
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-3xl aspect-[3/4] block shadow-2xl border border-white/10 hover:border-white/30 transition-all duration-700 bg-neutral-950"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-95"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Subtle Gradient Shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/95 transition-all duration-500" />

                  {/* Liquid Pill Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/50 backdrop-blur-xl border border-white/20 text-neutral-200">
                      {cat.itemCount}
                    </span>
                  </div>

                  {/* Frosted Glass Bottom Panel */}
                  <div className="absolute bottom-4 left-4 right-4 p-6 rounded-2xl bg-white/[0.08] backdrop-blur-2xl border border-white/20 text-white transition-all duration-500 group-hover:bg-white/[0.14] group-hover:border-white/40 shadow-2xl">
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-1 text-white">{cat.name}</h3>
                    <p className="text-xs text-neutral-300 font-light mb-4">{cat.subtitle}</p>
                    <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-cyan-300 group-hover:text-white transition-colors">
                      Discover Collection
                      <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. The ELEVARE Manifesto / Apple Editorial Quote */}
      <section className="relative py-32 overflow-hidden bg-black text-white border-b border-white/[0.08]">
        <LiquidBackground variant="ambient" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="none">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-indigo-400 block mb-6">
              The ELEVARE Manifesto
            </span>
            <blockquote className="font-serif italic text-2xl sm:text-4xl md:text-5xl text-neutral-100 font-normal leading-snug mb-8">
              &ldquo;True luxury is never loud. It lives in the precision of the cut, the purity of materials, and the effortless confidence of an intentional silhouette.&rdquo;
            </blockquote>
            <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-6" />
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-medium">
              ELEVARE Atelier • Paris — Tokyo — New York
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 7. New Arrivals Gallery */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-400 font-bold mb-2">Just Landed</p>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-300 hover:text-white font-semibold border-b border-white/30 pb-1 hover:border-white transition-all group"
            >
              Browse All Releases
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <ProductGrid
            products={newArrivalsData?.products || []}
            isLoading={newLoading}
          />
        </ScrollReveal>
      </section>

      {/* 8. Apple-style Liquid VIP Membership / Newsletter Banner */}
      <section className="relative py-28 border-t border-white/[0.08] overflow-hidden bg-gradient-to-b from-[#090a0f] to-[#0d0f1a]">
        <LiquidBackground variant="hero" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <ScrollReveal direction="up">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-white/[0.08] border border-white/20 text-indigo-300 mb-5 backdrop-blur-md">
              Private Salon Invitation
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 uppercase text-white">
              Join The ELEVARE Circle
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 mb-10 max-w-xl mx-auto font-light leading-relaxed">
              Receive private previews of limited seasonal capsules, exclusive runway access, and bespoke wardrobe consultations.
            </p>

            {newsletterSuccess ? (
              <div className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-sm animate-fade-in shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={18} />
                <span>Welcome to the ELEVARE Circle. Your private invitation is on its way.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="flex-1 px-5 py-3.5 rounded-full bg-white/[0.08] border border-white/20 text-white placeholder-neutral-400 text-xs tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/[0.12] transition-all backdrop-blur-md"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-white text-black hover:bg-neutral-100 px-8 py-3.5 rounded-full font-bold uppercase text-xs tracking-wider shrink-0 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-105 active:scale-95 transition-all"
                >
                  Request Access
                </Button>
              </form>
            )}

            <p className="text-[11px] text-neutral-500 mt-5 tracking-wide">
              Zero noise. Unsubscribe at any time with one click.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
