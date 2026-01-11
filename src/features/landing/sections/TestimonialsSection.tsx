'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { SectionWrapper } from '@/shared/components/SectionWrapper';
import { ScrollReveal } from '@/shared/components/ScrollReveal';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
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
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

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

    const navigateTo = useCallback((index: number, direction: 'left' | 'right') => {
        if (isAnimating || index === currentIndex) return;

        setIsAnimating(true);
        setSlideDirection(direction);
        setCurrentIndex(index);

        // Reset animation state after transition
        setTimeout(() => setIsAnimating(false), 500);
    }, [isAnimating, currentIndex]);

    const goToPrevious = useCallback(() => {
        const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
        navigateTo(newIndex, 'left');
    }, [currentIndex, testimonials.length, navigateTo]);

    const goToNext = useCallback(() => {
        const newIndex = (currentIndex + 1) % testimonials.length;
        navigateTo(newIndex, 'right');
    }, [currentIndex, testimonials.length, navigateTo]);

    // Auto-advance carousel every 5 seconds
    useEffect(() => {
        const interval = setInterval(goToNext, 5000);
        return () => clearInterval(interval);
    }, [goToNext]);

    // Calculate indices for 3-card view
    const getPrevIndex = () => currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    const getNextIndex = () => (currentIndex + 1) % testimonials.length;

    return (
        <SectionWrapper id="testimonials">
            <div className="space-y-12">
                {/* Header */}
                <ScrollReveal direction="up">
                    <div className="text-center space-y-4">
                        <h2 className="font-bold text-center">
              <span className="text-3xl sm:text-4xl md:text-4xl text-foreground">
                Apa Kata Mereka Mengenai Prestige Academy?
              </span>
                        </h2>
                        <p className="text-muted-foreground text-center max-w-3xl mx-auto">
                            Ribuan peserta sudah merasakan manfaat belajar di Prestige Academy dan berhasil mencapai impian mereka.
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={150}>
                    {/* Carousel Container */}
                    <div className="relative px-4">
                        {/* Desktop: Show 3 cards */}
                        <div className="hidden lg:flex justify-center items-center gap-6">
                            {/* Previous Card (left side) */}
                            <div
                                className="w-full max-w-sm transition-all duration-500 ease-out cursor-pointer"
                                onClick={goToPrevious}
                            >
                                <TestimonialCard
                                    testimonial={testimonials[getPrevIndex()]}
                                    variant="side"
                                />
                            </div>

                            {/* Current Card (center) */}
                            <div
                                className={cn(
                                    "w-full max-w-sm z-10 transition-all duration-500 ease-out",
                                    isAnimating && slideDirection === 'right' && "animate-slide-in-right",
                                    isAnimating && slideDirection === 'left' && "animate-slide-in-left"
                                )}
                            >
                                <TestimonialCard
                                    testimonial={testimonials[currentIndex]}
                                    variant="active"
                                />
                            </div>

                            {/* Next Card (right side) */}
                            <div
                                className="w-full max-w-sm transition-all duration-500 ease-out cursor-pointer"
                                onClick={goToNext}
                            >
                                <TestimonialCard
                                    testimonial={testimonials[getNextIndex()]}
                                    variant="side"
                                />
                            </div>
                        </div>

                        {/* Mobile/Tablet: Show 1 card */}
                        <div className="lg:hidden flex justify-center">
                            <div
                                className={cn(
                                    "w-full max-w-sm transition-all duration-500 ease-out",
                                    isAnimating && slideDirection === 'right' && "animate-slide-in-right",
                                    isAnimating && slideDirection === 'left' && "animate-slide-in-left"
                                )}
                            >
                                <TestimonialCard
                                    testimonial={testimonials[currentIndex]}
                                    variant="active"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex justify-center items-center gap-6 mt-8">
                        {/* Previous Button */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToPrevious}
                            disabled={isAnimating}
                            className={cn(
                                "rounded-full bg-background/90 backdrop-blur-sm border-2",
                                "transition-all duration-300",
                                "hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-medium",
                                "active:scale-95",
                                isAnimating && "opacity-50 cursor-not-allowed"
                            )}
                            aria-label="Testimoni sebelumnya"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>

                        {/* Dot Indicators */}
                        <div className="flex justify-center gap-3">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    disabled={isAnimating}
                                    className={cn(
                                        "relative rounded-full transition-all duration-300 ease-out",
                                        // Active state: pill shape
                                        index === currentIndex
                                            ? 'w-8 h-3 bg-primary shadow-colored-primary'
                                            : 'w-3 h-3 bg-muted-foreground/30 hover:bg-primary/70 hover:scale-125',
                                        isAnimating && "pointer-events-none"
                                    )}
                                    onClick={() => {
                                        const direction = index > currentIndex ? 'right' : 'left';
                                        navigateTo(index, direction);
                                    }}
                                    aria-label={`Ke testimoni ${index + 1}`}
                                    aria-current={index === currentIndex ? 'true' : 'false'}
                                >
                                    {/* Pulse effect on active dot */}
                                    {index === currentIndex && (
                                        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Next Button */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={goToNext}
                            disabled={isAnimating}
                            className={cn(
                                "rounded-full bg-background/90 backdrop-blur-sm border-2",
                                "transition-all duration-300",
                                "hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-medium",
                                "active:scale-95",
                                isAnimating && "opacity-50 cursor-not-allowed"
                            )}
                            aria-label="Testimoni selanjutnya"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </ScrollReveal>
            </div>
        </SectionWrapper>
    );
}

// Testimonial Card Component
interface TestimonialCardProps {
    testimonial: Testimonial;
    variant: 'active' | 'side';
}

function TestimonialCard({ testimonial, variant }: TestimonialCardProps) {
    const isActive = variant === 'active';

    return (
        <div
            className={cn(
                "flex flex-col items-center transition-all duration-500",
                isActive ? "scale-100 opacity-100" : "scale-90 opacity-60 hover:opacity-80"
            )}
        >
            {/* Avatar Card */}
            <Card
                className={cn(
                    "relative w-full mb-6 rounded-3xl overflow-hidden transition-all duration-500",
                    isActive
                        ? "shadow-large ring-2 ring-primary/20"
                        : "shadow-soft hover:shadow-medium"
                )}
            >
                {/* Position Badge */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge
                        variant="default"
                        className={cn(
                            "text-xs sm:text-sm font-semibold whitespace-nowrap shadow-soft px-3 py-1",
                            "transition-all duration-300",
                            isActive ? "scale-100" : "scale-90 opacity-80"
                        )}
                    >
                        {testimonial.position}
                    </Badge>
                </div>

                {/* Avatar Image */}
                <div className="h-[350px] relative overflow-hidden">
                    <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className={cn(
                            "object-cover object-top transition-transform duration-700",
                            isActive ? "scale-100" : "scale-105"
                        )}
                        priority={isActive}
                        sizes="(max-width: 640px) 100vw, 384px"
                    />

                    {/* Overlay for side cards */}
                    {!isActive && (
                        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                    )}

                    {/* Name Badge */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge
                            variant="outline"
                            className={cn(
                                "bg-card text-card-foreground font-bold px-5 py-3 shadow-soft border border-border",
                                "transition-all duration-300",
                                isActive ? "scale-100" : "scale-90"
                            )}
                        >
                            {testimonial.name}
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Content Card */}
            <Card
                className={cn(
                    "w-full rounded-2xl p-6 text-center border border-border",
                    "transition-all duration-500",
                    isActive
                        ? "bg-background shadow-medium"
                        : "bg-background/80 backdrop-blur-sm shadow-soft"
                )}
            >
                {/* Star Rating */}
                <div className="flex justify-center mb-3 gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={cn(
                                "w-4 h-4 transition-all",
                                i < testimonial.rating
                                    ? "text-rating fill-rating"
                                    : "text-muted-foreground/50",
                                isActive ? "scale-100" : "scale-90"
                            )}
                            style={{
                                transitionDelay: isActive ? `${i * 50}ms` : '0ms',
                                transitionDuration: '300ms'
                            }}
                        />
                    ))}
                </div>

                {/* Quote */}
                <p
                    className={cn(
                        "text-sm leading-relaxed italic transition-colors duration-300",
                        isActive ? "text-muted-foreground" : "text-muted-foreground/70"
                    )}
                >
                    &ldquo;{testimonial.content}&rdquo;
                </p>
            </Card>
        </div>
    );
}

export default TestimonialsSection;