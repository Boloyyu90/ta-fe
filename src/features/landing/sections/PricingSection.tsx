'use client';

import { Badge } from '@/shared/components/ui/badge';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { SectionWrapper } from '@/shared/components/SectionWrapper';
import Image from 'next/image';
import { Check, X, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const MASTER_FEATURES = [
  { id: 'tryout', text: 'Akses Tryout SKD Premium' },
  { id: 'video_discussion', text: 'Pembahasan Soal via Video' },
  { id: 'detailed_analysis', text: 'Analisis Hasil & Peringkat Nasional' },
  { id: 'discussion_group', text: 'Grup Diskusi Eksklusif' },
  { id: 'personal_consulting', text: 'Konsultasi Personal 1-on-1' },
  { id: 'interview_simulation', text: 'Simulasi Wawancara' },
  { id: 'guarantee', text: 'Garansi Lulus*' },
];

interface Package {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  badge?: string;
  includedFeatureIds: string[];
  featureDescriptions: { [key: string]: string };
}

const PriceDisplay = ({ price, originalPrice }: { price: number; originalPrice?: number }) => (
  <div className="space-y-1">
    <div className="flex items-baseline gap-2">
      <span className="text-xs text-muted-foreground">RP</span>
      <span className="text-2xl font-bold text-foreground">
        {price === 0 ? 'GRATIS' : price.toLocaleString('id-ID')}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-sm text-muted-foreground line-through">
          {originalPrice.toLocaleString('id-ID')}
        </span>
      )}
    </div>
    {originalPrice && originalPrice > price && (
      <Badge variant="destructive" className="text-xs">
        Hemat {Math.round(((originalPrice - price) / originalPrice) * 100)}%
      </Badge>
    )}
  </div>
);

const PackageCard = ({ pkg }: { pkg: Package }) => (
  <Card
    className={cn(
      'relative flex flex-col h-full overflow-hidden border-border hover:shadow-xl rounded-3xl p-6',
      'transition-all duration-300 group'
    )}
  >
    {pkg.popular && (
      <div className="absolute -right-12 top-8 z-20">
        <div className="bg-secondary px-12 py-2 rotate-45 shadow-lg">
          <span className="text-xs font-bold text-center text-white">
            POPULER
          </span>
        </div>
      </div>
    )}

    <div className="flex flex-col h-full">
      <div className="relative h-32 overflow-hidden mb-6 rounded-3xl border border-border">
        <Image
          src="/images/illustrations/marketing/card-banner.svg"
          alt="Package Banner"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-foreground">
              {pkg.title}
            </h3>
            <Badge
              variant={pkg.popular ? "secondary" : pkg.price === 0 ? "default" : "outline"}
              className="font-medium"
            >
              {pkg.badge || (pkg.price === 0 ? "Gratis!" : "Premium!")}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {pkg.description}
          </p>
        </div>

        <PriceDisplay price={pkg.price} originalPrice={pkg.originalPrice} />

        <div className="border-t border-border flex-1 pt-6 space-y-4">
          {MASTER_FEATURES.map((feature) => {
            const isIncluded = pkg.includedFeatureIds.includes(feature.id);
            const featureText = pkg.featureDescriptions[feature.id] || feature.text;

            return (
              <div key={feature.id} className="flex items-start gap-3">
                {isIncluded ? (
                  <Check className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-destructive/50 mt-1 flex-shrink-0" />
                )}
                <span className={cn("text-sm", !isIncluded && "text-muted-foreground line-through")}>
                  {featureText}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-4">
          <Button
            className="w-full group"
            size="lg"
            variant="default"
          >
            {pkg.price === 0 ? 'Coba Gratis' : 'Pilih Paket'}
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

export function PricingSection() {
  const packages: Package[] = [
    {
      id: "1",
      title: "Paket Gratis",
      description: "Coba platform kami dengan pengalaman yang menyegarkan.",
      price: 0,
      badge: "Gratis!",
      includedFeatureIds: ['tryout'],
      featureDescriptions: {
        'tryout': "Akses 1x Tryout SKD",
      }
    },
    {
      id: "2",
      title: "Paket Premium",
      description: "Persiapan lengkap untuk hasil maksimal.",
      price: 99000,
      originalPrice: 149000,
      popular: true,
      badge: "Terlaris!",
      includedFeatureIds: ['tryout', 'video_discussion', 'detailed_analysis', 'discussion_group'],
      featureDescriptions: {
        'tryout': "Akses 5x Tryout SKD",
        'video_discussion': "Pembahasan Soal via Video HD",
      }
    },
    {
      id: "3",
      title: "Paket Ultimate",
      description: "Paket terlengkap dengan bimbingan personal.",
      price: 199000,
      originalPrice: 299000,
      badge: "Best Value!",
      includedFeatureIds: ['tryout', 'video_discussion', 'detailed_analysis', 'discussion_group', 'personal_consulting', 'interview_simulation', 'guarantee'],
      featureDescriptions: {
        'tryout': "Akses 10x Tryout SKD",
      }
    }
  ];

  return (
    <SectionWrapper id="pricing">
      <div className="space-y-16">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h2 className="font-bold tracking-normal text-center">
            <span className="text-3xl sm:text-4xl md:text-4xl text-foreground">
              Pilih Paket Belajar Terbaik
            </span>
          </h2>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto">
            Mulai perjalanan sukses CASN Anda dengan paket yang dirancang sesuai kebutuhan dan budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          <p className="text-sm text-muted-foreground mb-4">
            *Syarat dan ketentuan berlaku. Garansi berlaku dengan ketentuan tertentu.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default PricingSection;
