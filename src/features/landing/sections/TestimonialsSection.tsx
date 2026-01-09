'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Section } from '@/shared/core/section';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Animate } from '@/shared/core/animate';
import { motion, AnimatePresence } from 'framer-motion';
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

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <Section
      id="testimonials"
      padding="lg"
      container="default"
    >
      <div className="space-y-16">

        <Animate animation="fadeInUp" className="text-center space-y-4">
          <h2 className="font-bold text-center">
            <span className="text-3xl sm:text-4xl md:text-4xl text-foreground">
             Apa Kata Mereka Mengenai Prestige Academy?
            </span>
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto">
            Ribuan peserta sudah merasakan manfaat belajar di Prestige Academy dan berhasil mencapai impian mereka.
          </p>
        </Animate>

        <div className="animate-fadeInUp animation-delay-fast">
          <div className="relative px-4 sm:px-8 md:px-12">
            <div className="h-8 mb-4"></div>

            <div className="relative h-[550px] md:h-[500px] overflow-visible">
              <div className="absolute inset-0 flex items-center justify-center">
                {testimonials.map((testimonial, index) => {
                  const offset = (index - currentIndex + testimonials.length) % testimonials.length;
                  const position = offset - 1;
                  const isInFrame = offset < 3;

                  return (
                    <motion.div
                      key={testimonial.id}
                      className={cn(
                        "absolute flex flex-col items-center w-full max-w-xs sm:max-w-sm",
                        !isInFrame && "hidden"
                      )}
                      initial={false}
                      animate={{
                        x: `${position * 100}%`,
                        scale: position === 0 ? 1.05 : 0.9,
                        opacity: position === 0 ? 1 : 0.4,
                        zIndex: position === 0 ? 20 : 10 - Math.abs(position),
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 25,
                        duration: 0.6
                      }}
                    >
                      <Card className="relative w-full mb-8 rounded-3xl overflow-hidden">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                          <Badge
                            variant="default"
                            className="text-xs sm:text-sm font-semibold whitespace-nowrap shadow-soft px-3 py-1"
                          >
                            {testimonial.position}
                          </Badge>
                        </div>

                        <div className="h-[350px]">
                          <div className="w-full h-full mx-auto relative rounded-3xl overflow-hidden">
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              fill
                              className="object-cover object-top"
                              priority={index === currentIndex}
                              sizes="(max-width: 640px) 80vw, 384px"
                            />
                          </div>

                          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 z-10">
                            <Badge
                              variant="outline"
                              className="bg-card text-card-foreground font-bold px-5 py-3 shadow-soft border border-border"
                            >
                              {testimonial.name}
                            </Badge>
                          </div>
                        </div>
                      </Card>

                      <Card className="w-full max-w-md rounded-2xl p-6 text-center bg-background/50 backdrop-blur-xl border border-border/50">
                        <div className="flex justify-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < testimonial.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground/50"
                              )}
                            />
                          ))}
                        </div>

                        <p className="text-muted-foreground text-sm leading-relaxed italic">
                          &ldquo;{testimonial.content}&rdquo;
                        </p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="h-8 mt-4"></div>

            <div className="flex justify-center items-center gap-6 mt-8 relative z-30">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                className="rounded-full bg-background/90 backdrop-blur-sm border-2 hover:bg-primary hover:text-primary-foreground"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex justify-center gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-fast ease-in-out",
                      index === currentIndex
                        ? 'bg-primary scale-125 shadow-soft'
                        : 'bg-muted-foreground/30 hover:bg-primary/70 hover:scale-110'
                    )}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                className="rounded-full bg-background/90 backdrop-blur-sm border-2 hover:bg-primary hover:text-primary-foreground"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default TestimonialsSection;
