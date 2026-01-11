'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { SectionWrapper } from '@/shared/components/SectionWrapper';
import { ScrollReveal } from '@/shared/components/ScrollReveal';
import { cn } from '@/shared/lib/utils';
import { Check, ChevronRight, Zap, Trophy, Library } from 'lucide-react';

interface Feature {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    benefits: string[];
    mockup: string;
    color: 'default' | 'secondary' | 'success';
}

export function FeaturesSection() {
    const [activeFeature, setActiveFeature] = useState('simulasi');

    const features: Feature[] = [
        {
            id: 'simulasi',
            title: 'Simulasi Ujian',
            subtitle: 'Mirip Asli',
            icon: Zap,
            description: 'Rasakan pengalaman ujian yang sesungguhnya dengan sistem tryout yang dirancang sama persis dengan tes CAT sesungguhnya.',
            benefits: [
                'Materi & soal terbaru', 'Analisis hasil otomatis', 'Simulasi ujian mirip asli'
            ],
            mockup: '/images/illustrations/marketing/features-asset-1.svg',
            color: 'default'
        },
        {
            id: 'bank-soal',
            title: 'Bank Soal Lengkap',
            subtitle: 'Teruji & Akurat',
            icon: Library,
            description: 'Dapatkan akses ke 50+ paket soal premium yang dirancang oleh tim ahli berdasarkan riset mendalam dari blueprint dan tren ujian tahun-tahun sebelumnya.',
            benefits: [
                '50+ paket soal siap pakai',
                'Sesuai blueprint ujian terbaru',
                'Tingkat kesulitan bervariasi (mudah, sedang, sulit)',
                'Termasuk pembahasan detail & kunci jawaban'
            ],
            mockup: '/images/illustrations/marketing/features-asset-2.svg',
            color: 'secondary'
        },
        {
            id: 'peringkat',
            title: 'Sistem Peringkat',
            subtitle: 'Kompetitif',
            icon: Trophy,
            description: 'Bersaing dengan ribuan peserta lain dan lihat posisi peringkat Anda untuk terus memotivasi diri menjadi yang terbaik.',
            benefits: ['Leaderboard nasional', 'Ranking berdasarkan kategori', 'Kompetisi mingguan & bulanan'],
            mockup: '/images/illustrations/marketing/features-asset-3.svg',
            color: 'success'
        }
    ];

    const activeFeatureData = features.find(f => f.id === activeFeature) || features[0];
    const activeColorName = activeFeatureData.color === 'default' ? 'primary' : activeFeatureData.color;

    const tabColorClasses = {
        default: 'bg-primary text-white',
        secondary: 'bg-secondary text-white',
        success: 'bg-success text-white'
    };

    const getIconColorClass = (color: string, isActive: boolean) => {
        if (isActive) return 'text-white';
        switch (color) {
            case 'secondary': return 'text-secondary';
            case 'success': return 'text-success';
            default: return 'text-primary';
        }
    };

    const getCheckBgClass = (colorName: string) => {
        switch (colorName) {
            case 'secondary': return 'bg-secondary/10';
            case 'success': return 'bg-success/10';
            default: return 'bg-primary/10';
        }
    };

    const getCheckTextClass = (colorName: string) => {
        switch (colorName) {
            case 'secondary': return 'text-secondary';
            case 'success': return 'text-success';
            default: return 'text-primary';
        }
    };

    return (
      <SectionWrapper id="features">
          <div className="relative z-10 space-y-8">
              <ScrollReveal direction="up">
                  <div className="text-center space-y-4">
                      <h2 className="font-bold tracking-normal text-center">
                          <span className="text-3xl sm:text-4xl md:text-4xl text-foreground">
                              Fitur Unggulan Prestige Academy
                          </span>
                      </h2>
                      <p className="text-muted-foreground text-center max-w-3xl mx-auto">
                          Persiapkan diri dengan pengalaman terbaik berbasis riset untuk menghadapi ujian di depan Anda.
                      </p>
                  </div>
              </ScrollReveal>

              <div className="max-w-7xl mx-auto">
                  <ScrollReveal direction="up" delay={150}>
                      <div className="mb-10">
                          <div className="flex justify-center">
                              <Card className={cn(
                                "flex flex-col items-stretch p-2 space-y-2 w-full max-w-sm rounded-full",
                                "lg:inline-flex lg:flex-row lg:items-center lg:space-y-0 lg:space-x-6 lg:w-auto lg:max-w-none"
                              )}>
                                  {/* NOTE: Menggunakan <button> manual karena tab buttons memiliki
                                      warna dinamis (primary/secondary/success) berdasarkan feature.color.
                                      Komponen Button shadcn tidak mendukung color variants seperti ini. */}
                                  {features.map((feature) => {
                                      const isActive = activeFeature === feature.id;
                                      const IconComponent = feature.icon;
                                      return (
                                        <button
                                          key={feature.id}
                                          onClick={() => setActiveFeature(feature.id)}
                                          className={cn(
                                            'relative flex items-center gap-3 px-5 py-3 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                            'justify-center w-full lg:w-auto lg:justify-start',
                                            isActive ? tabColorClasses[feature.color] : 'hover:bg-muted'
                                          )}
                                          aria-pressed={isActive}
                                        >
                                            <IconComponent className={cn('w-5 h-5 transition-colors', getIconColorClass(feature.color, isActive))} />
                                            <span className="font-semibold text-sm md:text-base whitespace-nowrap">
                                                {feature.title}
                                            </span>
                                        </button>
                                      );
                                  })}
                              </Card>
                          </div>
                      </div>
                  </ScrollReveal>

                  <div className={cn(
                    "flex flex-col gap-8",
                    "lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center"
                  )}>
                      <ScrollReveal direction="right" delay={300} className="order-1 lg:order-1 flex items-center justify-center">
                          <Image
                            src={activeFeatureData.mockup}
                            alt={`${activeFeatureData.title} mockup`}
                            width={600}
                            height={450}
                            className="w-full h-auto max-w-md"
                            priority={activeFeature === 'simulasi'}
                          />
                      </ScrollReveal>

                      <ScrollReveal direction="left" delay={300} className="order-2 lg:order-2 space-y-8">
                          <div className="space-y-4">
                              <h3 className="text-2xl sm:text-3xl font-bold leading-tight text-foreground">
                                  {activeFeatureData.title}{' '}
                                  <span className={cn('block', getCheckTextClass(activeColorName))}>
                                    {activeFeatureData.subtitle}
                                  </span>
                              </h3>
                              <p className="text-muted-foreground">{activeFeatureData.description}</p>
                          </div>

                          <div className="space-y-4">
                              {activeFeatureData.benefits.map((benefit, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-4"
                                >
                                    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0', getCheckBgClass(activeColorName))}>
                                        <Check className={cn('w-4 h-4', getCheckTextClass(activeColorName))} strokeWidth={3} />
                                    </div>
                                    <span className="font-medium">{benefit}</span>
                                </div>
                              ))}
                          </div>

                          <div className="pt-4">
                              <Button
                                size="lg"
                                variant="default"
                                className="group rounded-full px-8"
                              >
                                  Pelajari Lebih Lanjut
                                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                              </Button>
                          </div>
                      </ScrollReveal>
                  </div>
              </div>
          </div>
      </SectionWrapper>
    );
}

export default FeaturesSection;
