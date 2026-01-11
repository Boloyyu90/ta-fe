'use client';

import Image from 'next/image';
import { Badge } from '@/shared/components/ui/badge';
import { SectionWrapper } from '@/shared/components/SectionWrapper';

export function AboutSection() {
    const features = [
        '#Simulasi CAT CPNS',
        '#Pengawasan AI Real-time',
        '#Analisis Hasil Mendalam',
        '#Bank Soal Terupdate'
    ];

    return (
        <SectionWrapper id="about">
            <div className="animate-fade-in-up">
                <div className="mb-12 sm:mb-14 md:mb-16 lg:flex justify-center hidden">
                    <div className="inline-flex items-center rounded-full bg-card border border-border px-4 sm:px-6 py-2 sm:py-3 shadow-soft hover:shadow-medium transition-all">
            <span className="text-card-foreground text-xs sm:text-sm font-medium">
              Latihan ujian dengan pengawasan seperti tes sesungguhnya!
            </span>
                        <span className="ml-2 text-primary whitespace-nowrap text-xs sm:text-sm font-semibold">
              Mulai tryout sekarang &rarr;
            </span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-14 lg:gap-16 items-center">
                <div className="lg:order-1 order-2 animate-fade-in-right" style={{ animationDelay: '150ms' }}>
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
                            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                                {features.map((feature, index) => (
                                    <Badge
                                        key={`mobile-${index}`}
                                        variant="outline"
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                                    >
                                        {feature}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:order-2 order-1 space-y-6 sm:space-y-7 md:space-y-8 text-center sm:text-center md:text-center lg:text-left animate-fade-in-left" style={{ animationDelay: '150ms' }}>
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
                            Prestige Academy adalah platform tryout CPNS yang dilengkapi
                            dengan <span className="text-foreground font-medium">sistem pengawasan berbasis AI</span>.
                            Kami menghadirkan pengalaman simulasi ujian yang realistis,
                            lengkap dengan deteksi kecurangan real-time menggunakan
                            teknologi <span className="text-foreground font-medium">YOLO Machine Learning</span> untuk
                            memastikan integritas setiap sesi latihan.
                        </p>
                        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed hidden lg:block">
                            Dengan fitur proctoring otomatis, setiap tryout yang kamu
                            kerjakan akan dipantau layaknya ujian CAT sesungguhnya.
                            Sistem kami mendeteksi pergerakan wajah, kehadiran orang lain,
                            dan aktivitas mencurigakan — sehingga kamu terbiasa dengan
                            tekanan ujian sebelum hari-H tiba.
                        </p>
                    </div>

                    <div className="hidden lg:block">
                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                            {features.map((feature, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                                >
                                    {feature}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
}

export default AboutSection;