"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselSlide {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
}

const SLIDES: CarouselSlide[] = [
  {
    image: "/images/homepage/image1.png",
    badge: "Contemporary LifeWear",
    title: "Thoughtful Design for Everyday Ease",
    subtitle:
      "Engineered with premium natural textures and tailored minimalist proportions for modern comfort.",
  },
  {
    image: "/images/homepage/image2.png",
    badge: "Seasonal Palette",
    title: "Natural Silhouettes & Relaxed Lines",
    subtitle:
      "Versatile layers designed to seamlessly adapt between work, leisure, and daily lifestyle.",
  },
  {
    image: "/images/homepage/image3.png",
    badge: "Modern Wardrobe Essentials",
    title: "Timeless Quality, Everyday Elegance",
    subtitle:
      "Clean silhouettes, durable craftsmanship, and conscious materials designed to endure.",
  },
  {
    image: "/images/homepage/image4.png",
    badge: "Subtle Sophistication",
    title: "Refined Textures & Uncompromised Utility",
    subtitle:
      "Contemporary pieces curated for confident, effortless expression across all genders.",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  }, []);

  // Auto-advance timer (pauses when user hovers)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Lifestyle Featured Carousel"
    >
      {/* Slides Container */}
      <div className="relative h-[420px] sm:h-[500px] md:h-[580px] w-full">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center"
              />

              {/* Gradient Overlay for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/50 to-transparent sm:w-2/3" />

              {/* Content Overlay */}
              <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center px-6 sm:px-12 md:px-16 text-left">
                <span className="mb-3 inline-block self-start rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-semibold tracking-wider text-white border border-white/20 uppercase">
                  {slide.badge}
                </span>

                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-[1.1]">
                  {slide.title}
                </h2>

                <p className="mt-4 text-sm sm:text-base text-neutral-200/90 leading-relaxed max-w-lg">
                  {slide.subtitle}
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <Link href="/products">
                    <Button
                      size="lg"
                      className="bg-white text-neutral-950 hover:bg-neutral-100 shadow-md font-semibold gap-2 transition-transform duration-200 hover:scale-105"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentSlide === idx
                ? "w-8 bg-white"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
