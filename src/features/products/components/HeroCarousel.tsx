"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
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
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Autoplay plugin configuration (5 seconds, stop on hover)
  const plugins = useMemo(
    () => [
      Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
    ],
    []
  );

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrentSlide(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    queueMicrotask(() => onSelect());
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        plugins={plugins}
        opts={{
          loop: true,
          align: "start",
        }}
        className="w-full overflow-hidden rounded-3xl bg-neutral-900 text-white shadow-xl"
        aria-label="Lifestyle Featured Carousel"
      >
        <CarouselContent className="-ml-0">
          {SLIDES.map((slide, idx) => (
            <CarouselItem key={slide.image} className="relative pl-0">
              <div className="relative h-[420px] sm:h-[500px] md:h-[580px] w-full">
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
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Prev / Next Controls with Shadcn Carousel Buttons */}
        <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border-none text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 cursor-pointer" />
        <CarouselNext className="right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 border-none text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 cursor-pointer" />

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}
