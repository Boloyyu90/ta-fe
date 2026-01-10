'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { SectionWrapper } from '@/shared/components/SectionWrapper';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { FadeIn } from '@/shared/components/animations';
import { cn } from '@/shared/lib/utils';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  avatar: string;
  content: string;
  rating: number;
}

export function TestimonialsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Nurul Hidayah',
      position: 'PNS Pemerintah Nganjuk',
      avatar: '/images/avatars/nurul.png',
      content: 'Platform yang paling cocok untuk freshgraduate dengan budget pas-pasan, harganya terjangkau tapi ilmunya sangat mahal.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Jessica Halim',
      position: 'Staff Ahli Pemerintah Guangzhou',
      avatar: '/images/avatars/jessica.png',
      content: 'Fitur analisis hasil di Prestige Academy luar biasa! Saya bisa melihat progress belajar dan tahu di bagian mana yang perlu diperbaiki.',
      rating: 5,
    },
    {
      id: '3',
      name: 'Darrel Simanjuntak',
      position: 'Analis Kebijakan Bukittinggi',
      avatar: '/images/avatars/darrel.png',
      content: 'Setelah 3 kali gagal CPNS, akhirnya dengan Prestige Academy saya berhasil! Simulasi ujiannya sangat realistis dan bank soalnya update.',
      rating: 5,
    },
  ];

  const scrollToIndex = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.scrollWidth / testimonials.length;
      container.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
    }
  }, [testimonials.length]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  }, [currentIndex, testimonials.length, scrollToIndex]);

  const goToNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % testimonials.length;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  }, [currentIndex, testimonials.length, scrollToIndex]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = container.scrollWidth / testimonials.length;
        const newIndex = Math.round(container.scrollLeft / cardWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < testimonials.length) {
          setCurrentIndex(newIndex);
        }
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [currentIndex, testimonials.length]);

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <SectionWrapper id="testimonials">
      <div className="space-y-12">
        <FadeIn direction="up" className="text-center space-y-4">
          <h2 className="font-bold text-center">
            <span className="text-3xl sm:text-4xl md:text-4xl text-foreground">
             Apa Kata Mereka Mengenai Prestige Academy?
            </span>
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto">
            Ribuan peserta sudah merasakan manfaat belajar di Prestige Academy dan berhasil mencapai impian mereka.
          </p>
        </FadeIn>

        <FadeIn direction="up" delay={200}>
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="flex-shrink-0 w-full max-w-sm snap-center mx-auto"
              >
                <div className="flex flex-col items-center">
                  <Card className="relative w-full mb-6 rounded-3xl overflow-hidden">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge
                        variant="default"
                        className="text-xs sm:text-sm font-semibold whitespace-nowrap shadow-soft px-3 py-1"
                      >
                        {testimonial.position}
                      </Badge>
                    </div>

                    <div className="h-[350px] relative">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover object-top"
                        priority={index === 0}
                        sizes="(max-width: 640px) 100vw, 384px"
                      />

                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge
                          variant="outline"
                          className="bg-card text-card-foreground font-bold px-5 py-3 shadow-soft border border-border"
                        >
                          {testimonial.name}
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  <Card className="w-full rounded-2xl p-6 text-center bg-background/80 backdrop-blur-sm border border-border">
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < testimonial.rating
                              ? "text-rating fill-rating"
                              : "text-muted-foreground/50"
                          )}
                        />
                      ))}
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-6 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="rounded-full bg-background/90 backdrop-blur-sm border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex justify-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? 'bg-primary scale-125 shadow-soft'
                      : 'bg-muted-foreground/30 hover:bg-primary/70 hover:scale-110'
                  )}
                  onClick={() => {
                    setCurrentIndex(index);
                    scrollToIndex(index);
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="rounded-full bg-background/90 backdrop-blur-sm border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}

export default TestimonialsSection;
