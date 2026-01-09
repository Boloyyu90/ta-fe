'use client';

import Image from 'next/image';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Animate } from '@/shared/core/animate';

interface Benefit {
  step: number;
  title: string;
  subtitle: string;
  description: string;
}

export function BenefitsSection() {
  const benefits: Benefit[] = [
    {
      step: 1,
      title: "Latihan Seru Mirip",
      subtitle: "UJIAN ASLI!",
      description: "Rasakan sensasi ujian CPNS, SNBT, dan P3K tanpa perlu tegang! Soal-soal kami dibuat persis seperti ujian sungguhan, jadi kamu bisa berlatih dengan nyaman dan tidak kaget saat hari-H."
    },
    {
      step: 2,
      title: "Tahu Peluang Kelulusanmu",
      subtitle: "SEJAK AWAL!",
      description: "Gak perlu nebak-nebak! Berdasarkan hasil latihanmu, kami bisa kasih gambaran peluang kelulusanmu dengan jelas. Jadi kamu tahu harus berapa semangat lagi untuk mencapai impianmu!"
    },
    {
      step: 3,
      title: "Penjelasan yang Bikin",
      subtitle: '"OHHHH"!',
      description: 'Dapatkan jawaban yang bikin kamu langsung paham! Bukan cuma tau jawaban benarnya apa, tapi juga "kenapa" dengan bahasa yang enak dibaca. Dijamin ada momen "Ohhh, jadi begitu!" setiap kali belajar.'
    },
    {
      step: 4,
      title: "Lemari Soal yang Selalu",
      subtitle: "DIISI ULANG",
      description: "Jangan khawatir kehabisan soal! Lemari soal kami selalu penuh dengan berbagai tipe pertanyaan yang selalu diperbarui. Dari yang gampang sampai yang bikin mikir, semua ada untuk membuat belajarmu lebih seru."
    },
    {
      step: 5,
      title: "Lihat Kemajuanmu",
      subtitle: "NAIK TERUS!",
      description: "Saksikan perjalanan belajarmu melalui grafik yang colorful dan mudah dipahami melalui statistik ranking. Rasakan kegembiraan melihat garis progressmu naik terus!"
    }
  ];

  return (
    <section id="benefits" className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="hidden lg:block absolute top-40 left-0 pointer-events-none">
          <Image
            src="/images/backgrounds/benefit-asset-top.svg"
            alt=""
            width={130}
            height={130}
            className="object-contain"
          />
        </div>
        <div className="hidden lg:block absolute bottom-0 right-0 pointer-events-none">
          <Image
            src="/images/backgrounds/benefit-asset-bottom.svg"
            alt=""
            width={130}
            height={130}
            className="object-contain"
          />
        </div>

        <div className="lg:hidden absolute top-32 sm:top-12 left-0 pointer-events-none">
          <div
            className="bg-no-repeat bg-contain bg-left-top"
            style={{
              backgroundImage: `url('/images/backgrounds/benefit-asset-top.svg')`,
              width: 'clamp(280px, 70vw, 400px)',
              height: 'clamp(280px, 70vw, 400px)'
            }}
          />
        </div>
        <div className="lg:hidden absolute bottom-0 right-0 pointer-events-none">
          <div
            className="bg-no-repeat bg-contain bg-right-bottom"
            style={{
              backgroundImage: `url('/images/backgrounds/benefit-asset-bottom.svg')`,
              width: 'clamp(280px, 70vw, 400px)',
              height: 'clamp(280px, 70vw, 400px)'
            }}
          />
        </div>

        <div className="relative z-10 space-y-12 sm:space-y-14 md:space-y-16">
          <Animate animation="fadeInUp" className="text-center space-y-3 sm:space-y-4">
            <h2 className="font-bold tracking-normal text-center px-2">
              <span className="text-3xl sm:text-4xl md:text-4xl text-foreground">
                Kenapa harus Tryout {''}
              </span>
              <span className="text-3xl sm:text-4xl md:text-4xl text-foreground">
                di Prestige Academy?
              </span>
            </h2>
          </Animate>

          <div className="relative max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto">
            <Card className="relative shadow-md overflow-hidden p-6 sm:p-7 md:p-8 rounded-3xl">

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="block lg:hidden">
                  <Image
                    src="/images/logo/logo-prestige-blue.svg"
                    alt=""
                    width={400}
                    height={400}
                    className="object-contain opacity-5"
                  />
                </div>
                <div className="hidden lg:block">
                  <Image
                    src="/images/logo/logo-prestige-blue.svg"
                    alt=""
                    width={400}
                    height={400}
                    className="object-contain opacity-5"
                  />
                </div>
              </div>

              <div className="hidden lg:block absolute top-20 bottom-20 xl:top-24 xl:bottom-24 left-1/2 w-1 -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/70 to-transparent" />

              <div className="relative space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16 py-6 sm:py-7 md:py-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit.step}
                    className="relative lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-x-12 lg:items-center animate-fadeInUp"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="relative lg:col-start-2 z-10">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-16 lg:h-16 mx-auto bg-background flex items-center justify-center rounded-full">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-14 lg:h-14 bg-primary text-white flex items-center justify-center rounded-full text-lg sm:text-xl font-bold">
                          {benefit.step}
                        </div>
                      </div>
                    </div>

                    <div className={cn(
                      "mt-4 lg:mt-0 text-center px-4 sm:px-6 md:px-8 lg:px-0",
                      index % 2 === 0
                        ? "lg:col-start-1 lg:row-start-1 lg:text-right"
                        : "lg:col-start-3 lg:row-start-1 lg:text-left"
                    )}>
                      <div className="space-y-1 sm:space-y-2">
                        <h3 className="uppercase text-muted-foreground text-xs sm:text-sm md:text-base lg:text-base font-semibold">
                          {benefit.title}
                        </h3>
                        <h4 className="uppercase text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground">
                          {benefit.subtitle}
                        </h4>
                      </div>
                      <p className="text-muted-foreground mt-2 sm:mt-3 text-xs sm:text-sm md:text-base lg:text-base max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm mx-auto lg:mx-0 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
