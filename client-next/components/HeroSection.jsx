"use client";

import { ScrambledTitle } from "@/components/RainingLetters";

export default function HeroSection() {
  return (
    <section className="relative z-20 w-full h-screen flex flex-col items-center justify-center text-center gap-6 px-6 pt-20">
      <div className="flex flex-col items-center gap-4 max-w-3xl">
        <ScrambledTitle />
        <p className="text-gray-300 text-lg md:text-xl">
          Shorten your URLs with style. Fast, free, and beautiful — now with live previews,
          analytics, and a seamless dark experience.
        </p>
      </div>
    </section>
  );
}
