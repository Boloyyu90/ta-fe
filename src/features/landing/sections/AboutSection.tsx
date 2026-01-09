'use client';

import Image from 'next/image';
import { Badge } from '@/shared/components/ui/badge';
import { Section } from '@/shared/core/section';
import { ContentAnimate, StaggerContainer } from '@/shared/core/animate';

export function AboutSection() {
  const features = [
    '#Platform Terintegrasi',
    '#Soal Berbasis Field Report',
    '#Evaluasi Diagnostik Presisi Tinggi',
    '#Komunitas Profesional'
  ];

  return (
    <Section id="about" variant="transparent" padding="lg">
      <ContentAnimate animation="fadeInUp">
        <div className="mb-12 sm:mb-14 md:mb-16 lg:flex justify-center hidden">
          <div className="inline-flex items-center rounded-full bg-card border border-border px-4 sm:px-6 py-2 sm:py-3 shadow-soft hover:shadow-medium transition-all duration-fast">
            <span className="text-card-foreground text-xs sm:text-sm font-medium">
              Tingkatkan nilai dengan simulasi berbasis riset!
            </span>
            <span className="ml-2 text-primary whitespace-nowrap text-xs sm:text-sm font-semibold">
              Jadilah peserta berikutnya &rarr;
            </span>
          </div>
        </div>
      </ContentAnimate>

      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-14 lg:gap-16 items-center">

        <ContentAnimate animation="fadeInLeft" className="lg:order-1 order-2">
          <div className="relative max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto lg:mx-0">
            <Image
              src="/images/illustrations/marketing/about-asset.svg"
              alt="About Prestige Academy"
              width={550}
              height={450}
              className="w-full h-auto"
              priority
              sizes="(min-width: 1024px) 550px, (min-width: 768px) 448px, (min-width: 640px) 384px, 320px"
            />

            <div className="lg:hidden mt-6">
              <StaggerContainer
                staggerDelay={120}
                animation="scaleIn"
                speed="fast"
                className="flex flex-wrap gap-2 sm:gap-3 justify-center"
              >
                {features.map((feature, index) => (
                  <Badge
                    key={`mobile-${index}`}
                    variant="outline"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 transition-all"
                  >
                    {feature}
                  </Badge>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </ContentAnimate>

        <ContentAnimate animation="fadeInRight" className="lg:order-2 order-1 space-y-6 sm:space-y-7 md:space-y-8 text-center sm:text-center md:text-center lg:text-left">
          <h2 className="tracking-normal space-y-2 font-bold">
            <span className="block text-3xl sm:text-4xl md:text-4xl text-foreground">
              Tentang,
            </span>
            <span className="block text-3xl sm:text-4xl md:text-4xl">
              <span className="text-primary">Prestige</span>{' '}
              <span className="text-secondary">Academy</span>
            </span>
          </h2>

          <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-lg mx-auto lg:mx-0">
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Selamat datang di Prestige Academy, tempat di mana semangat
              belajar dan potensi berharga bertemu. Seperti Jalak Bali yang
              langka dan istimewa, kami percaya bahwa setiap individu
              memiliki keunikan, transformasi pengetahuan, dan kebebasan
              untuk terbang menuju puncak prestasi.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed hidden lg:block">
              Bersama kami, kamu akan dipersiapkan dengan materi dan tryout
              berkualitas untuk menghadapi seleksi-seleksi penting, dengan
              keseimbangan sempurna antara tradisi dan inovasi.
              Bergabunglah dan terbang lebih tinggi bersama kami!
            </p>
          </div>

          <div className="hidden lg:block">
            <StaggerContainer
              staggerDelay={120}
              animation="scaleIn"
              speed="fast"
              className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start"
            >
              {features.map((feature, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 hover:scale-105 transition-all"
                >
                  {feature}
                </Badge>
              ))}
            </StaggerContainer>
          </div>
        </ContentAnimate>
      </div>
    </Section>
  );
}

export default AboutSection;
