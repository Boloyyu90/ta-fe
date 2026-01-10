'use client';

import { Button } from "@/shared/components/ui/button";
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-16">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-[48vw] h-full hidden lg:block motion-safe:animate-fade-in-right delay-200">
          <Image
            src="/images/backgrounds/hero-asset-left.svg"
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="42vw"
            priority={false}
          />
        </div>

        <div className="absolute bottom-0 right-0 w-[75vw] sm:w-[65vw] md:w-[55vw] lg:w-[48vw] h-full motion-safe:animate-fade-in-left delay-200">
          <Image
            src="/images/backgrounds/hero-asset-right.svg"
            alt="CPNS Professional"
            fill
            className="object-contain object-bottom"
            priority
            sizes="(min-width: 1024px) 45vw, (min-width: 768px) 55vw, (min-width: 640px) 65vw, 75vw"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-start min-h-[calc(100vh-4rem)] pt-20 pb-8 lg:pl-32">
          <div className="w-full lg:w-[55%] xl:w-[50%]">

            <div className="mb-8 motion-safe:animate-fade-in-up">
              <h1 className="tracking-normal text-center sm:text-center md:text-center lg:text-left space-y-2">
                <span className="block text-foreground font-bold text-3xl sm:text-4xl md:text-5xl">Langkah Awal</span>
                <span className="block text-foreground font-bold text-3xl sm:text-4xl md:text-5xl">Menuju Karir</span>
                <span className="block font-bold text-3xl sm:text-4xl md:text-5xl">
                  Impian{' '}
                  <span className="relative text-primary font-bold text-3xl sm:text-4xl md:text-5xl">
                    CPNS!
                    <span className="absolute bottom-0 left-0 w-full h-1 sm:h-1.5 lg:h-1.5 bg-secondary rounded-full origin-left scale-x-0 motion-safe:animate-[scaleX_0.6s_ease-out_0.8s_forwards]"></span>
                  </span>
                </span>
              </h1>
            </div>

            <div className="mb-6 motion-safe:animate-fade-in-up delay-100">
              <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto sm:mx-auto md:mx-auto lg:mx-0 text-center sm:text-center md:text-center lg:text-left leading-relaxed">
                Prestige Academy membuka sayap menuju era cemerlangmu! Seperti Jalak Bali yang istimewa, kami mengubah pengetahuan menjadi pencerahan. Terbang tinggi bersama kami, melestarikan nilai berharga sambil menembus batas potensimu!
              </p>
            </div>

            <div className="motion-safe:animate-fade-in-up delay-300">
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center sm:justify-center md:justify-center lg:justify-start">
                <Button
                  size="lg"
                  variant="secondary"
                  className="font-semibold shadow-colored-secondary min-w-[200px] w-full sm:w-auto hover:scale-105 transition-transform"
                  asChild
                >
                  <Link href="/register">
                    Belajar Sekarang!
                  </Link>
                </Button>

                <Button
                  variant="default"
                  size="lg"
                  className="font-semibold text-white hover:bg-primary/90 min-w-[140px] w-full sm:w-auto hover:scale-105 transition-transform"
                  asChild
                >
                  <Link href="/login">
                    Masuk
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
