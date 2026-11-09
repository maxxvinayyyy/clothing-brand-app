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
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useFeaturedProducts, useProducts } from '@/hooks/useProducts';

const categories = [
  {
    name: 'Men',
    slug: 'men',
    subtitle: 'Tailored Essentials & Outerwear',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    itemCount: '18 Styles',
  },
  {
    name: 'Women',
    slug: 'women',
    subtitle: 'Contemporary Silhouettes & Dresses',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    itemCount: '24 Styles',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    subtitle: 'Italian Leather & Minimal Accents',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    itemCount: '12 Styles',
  },
];

const pillars = [
  {
    icon: Truck,
    title: 'Complimentary Express Shipping',
    desc: 'On all orders exceeding $100 worldwide with carbon-neutral transit.',
  },
  {
    icon: ShieldCheck,
    title: 'Sustainable Atelier Craft',
    desc: 'Certified organic Japanese cotton, Italian wool, and ethical hides.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Effortless Returns',
    desc: 'Prepaid return label enclosed with every parcel. No questions asked.',
  },
  {
    icon: Clock,
    title: 'Dedicated Client Concierge',
    desc: 'Bespoke sizing advice and wardrobe guidance available 24/7.',
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
    <div className="overflow-x-hidden">
      {/* 1. Dynamic Luxury Marquee Ticker */}
      <div className="bg-black text-white text-xs font-medium uppercase tracking-[0.25em] py-2.5 overflow-hidden border-b border-white/10 select-none">
        <div className="flex w-[200%] animate-marquee">
          <div className="flex shrink-0 items-center justify-around w-full gap-8">
            <span>✨ Complimentary Worldwide Express Delivery Over $100</span>
            <span>•</span>
            <span>ELEVARE ATELIER SS26 READY-TO-WEAR</span>
            <span>•</span>
            <span>ELEVATE YOUR EVERYDAY AESTHETIC</span>
            <span>•</span>
            <span>ETHICALLY SOURCED MATERIALS</span>
            <span>•</span>
            <span>30-DAY COMPLIMENTARY RETURNS</span>
            <span>•</span>
          </div>
          <div className="flex shrink-0 items-center justify-around w-full gap-8">
            <span>✨ Complimentary Worldwide Express Delivery Over $100</span>
            <span>•</span>
            <span>ELEVARE ATELIER SS26 READY-TO-WEAR</span>
            <span>•</span>
            <span>ELEVATE YOUR EVERYDAY AESTHETIC</span>
            <span>•</span>
            <span>ETHICALLY SOURCED MATERIALS</span>
            <span>•</span>
            <span>30-DAY COMPLIMENTARY RETURNS</span>
            <span>•</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section with Ken Burns Zoom & Glassmorphism */}
      <section className="relative h-[92vh] min-h-[640px] flex items-center justify-center overflow-hidden bg-black text-white">
        {/* Background Image with Ken Burns Zoom */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2000&q=85"
            alt="ELEVARE Editorial Collection"
            fill
            priority
            className="object-cover object-center animate-kenburns opacity-60 scale-100"
          />
          {/* Subtle Ambient Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <ScrollReveal direction="down" delay={100}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium tracking-[0.2em] uppercase mb-6 text-gray-200">
              <Sparkles size={13} className="text-amber-300" />
              <span>Spring / Summer 2026 Collection</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.95] uppercase font-sans">
              Elevate Your<br />
              <span className="font-serif italic font-normal tracking-normal lowercase text-4xl sm:text-5xl md:text-6xl text-gray-200">
                everyday aesthetic.
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300}>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              Architectural cuts, purest organic textures, and intentional minimalism designed for individuals who command presence without saying a word.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 px-8 py-4 font-semibold tracking-wide uppercase text-xs rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Explore Collection
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/products?featured=true" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto border border-white/40 text-white bg-white/5 backdrop-blur-md hover:bg-white/15 px-8 py-4 font-semibold tracking-wide uppercase text-xs rounded-full hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  View Lookbook
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-white/80">Scroll</span>
          <div className="w-4 h-7 rounded-full border border-white/60 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* 3. Luxury Brand Pillars / Trust Bar */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <ScrollReveal key={pillar.title} delay={idx * 100} direction="up">
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50/80 transition-colors duration-300">
                    <div className="p-3 rounded-full bg-gray-100 text-gray-900 shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">{pillar.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Featured Collection with ScrollReveal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold mb-2">Curated Edit</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Featured Highlights
              </h2>
            </div>
            <Link
              href="/products?featured=true"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-900 hover:text-black font-semibold border-b border-gray-900 pb-0.5 hover:border-black transition-all group"
            >
              View Full Gallery
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <ProductGrid
            products={featuredData?.products || []}
            isLoading={featuredLoading}
          />
        </ScrollReveal>
      </section>

      {/* 5. Luxury Category Showcase with Hover Zoom & Glassmorphism */}
      <section className="bg-gray-50/70 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center max-w-xl mx-auto mb-16">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold mb-2">Architectural Wardrobe</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                Shop By Category
              </h2>
              <p className="text-sm text-gray-500">
                Discover pieces cut from Japanese denims, virgin wools, and buttery Nappa leathers.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <ScrollReveal key={cat.slug} delay={idx * 150} direction="up">
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] block shadow-sm hover:shadow-2xl transition-all duration-700 bg-gray-900"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Subtle Gradient Veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {cat.itemCount}
                    </span>
                  </div>

                  {/* Bottom Glassmorphic Card */}
                  <div className="absolute bottom-4 left-4 right-4 p-5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white transition-all duration-500 group-hover:bg-white/20">
                    <h3 className="text-2xl font-bold tracking-tight mb-1">{cat.name}</h3>
                    <p className="text-xs text-white/80 mb-3">{cat.subtitle}</p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-white group-hover:text-amber-300 transition-colors">
                      Explore Edits
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. The ELEVARE Manifesto / Editorial Quote */}
      <section className="bg-black text-white py-28 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="none">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-gray-400 block mb-6">
              The ELEVARE Manifesto
            </span>
            <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-gray-100 font-normal leading-snug mb-8">
              &ldquo;True luxury is never loud. It lives in the precision of the cut, the honesty of natural fibers, and the quiet confidence of an effortless silhouette.&rdquo;
            </blockquote>
            <div className="w-16 h-[1px] bg-white/30 mx-auto mb-6" />
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold">
              ELEVARE Design Studio • Paris — New York
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 7. New Arrivals with ScrollReveal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400 font-semibold mb-2">Just Landed</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-900 hover:text-black font-semibold border-b border-gray-900 pb-0.5 hover:border-black transition-all group"
            >
              Shop All Styles
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <ProductGrid
            products={newArrivalsData?.products || []}
            isLoading={newLoading}
          />
        </ScrollReveal>
      </section>

      {/* 8. Luxury VIP Club / Newsletter Banner */}
      <section className="bg-gradient-to-br from-neutral-900 via-black to-neutral-950 text-white py-24 relative overflow-hidden border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <ScrollReveal direction="up">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-white/10 border border-white/20 text-gray-300 mb-4">
              Private Salon Access
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
              Join The ELEVARE Circle
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-8 max-w-xl mx-auto font-light leading-relaxed">
              Receive complimentary invitations to private seasonal previews, limited capsule drops, and bespoke styling edits.
            </p>

            {newsletterSuccess ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm animate-fade-in">
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
                  className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/15 transition-all"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-7 py-3.5 rounded-full font-semibold uppercase text-xs tracking-wider shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  Request Access
                </Button>
              </form>
            )}

            <p className="text-[11px] text-gray-500 mt-4 tracking-wide">
              Zero spam. You may withdraw your subscription at any time.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
