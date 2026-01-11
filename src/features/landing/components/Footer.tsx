'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { ScrollReveal } from '@/shared/components/ScrollReveal';

export function Footer() {
    const currentYear = new Date().getFullYear();

    const services = [
        { label: 'Tryout CPNS', href: '#' },
        { label: 'Tryout SNBT', href: '#' },
        { label: 'Tryout Kedinasan', href: '#' },
        { label: 'Tryout BUMN', href: '#' },
    ];

    const information = [
        { label: 'Tentang Kami', href: '#about' },
        { label: 'Fitur', href: '#features' },
        { label: 'Harga', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
    ];

    const legal = [
        { label: 'Kebijakan Privasi', href: '#' },
        { label: 'Syarat & Ketentuan', href: '#' },
    ];

    const socialMedia = [
        { name: 'Facebook', icon: Facebook, href: '#' },
        { name: 'Twitter', icon: Twitter, href: '#' },
        { name: 'Instagram', icon: Instagram, href: '#' },
        { name: 'LinkedIn', icon: Linkedin, href: '#' },
    ];

    return (
        <footer className="relative w-full overflow-hidden">
            {/* Background Assets Layer */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Left Asset */}
                <div className="absolute bottom-0 left-0 w-[280px] sm:w-[320px] md:w-[380px] lg:w-[520px] xl:w-[600px] h-full animate-fade-in-right">
                    <Image
                        src="/images/backgrounds/footer-asset-left.svg"
                        alt=""
                        fill
                        className="object-contain object-bottom"
                        sizes="(min-width: 1280px) 600px, (min-width: 1024px) 520px, (min-width: 768px) 380px, (min-width: 640px) 320px, 280px"
                    />
                </div>

                {/* Right Asset */}
                <div className="absolute bottom-0 right-0 w-[280px] sm:w-[320px] md:w-[380px] lg:w-[520px] xl:w-[600px] h-full animate-fade-in-left">
                    <Image
                        src="/images/backgrounds/footer-asset-right.svg"
                        alt=""
                        fill
                        className="object-contain object-bottom"
                        sizes="(min-width: 1280px) 600px, (min-width: 1024px) 520px, (min-width: 768px) 380px, (min-width: 640px) 320px, 280px"
                    />
                </div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 pt-12 sm:pt-14 md:pt-16 lg:pt-20 xl:pt-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Centered Container with responsive max-width */}
                    <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
                        <ScrollReveal direction="up">
                            {/* Primary Card Container */}
                            <div className="bg-primary rounded-t-3xl sm:rounded-t-[2.5rem] overflow-hidden shadow-large">
                                <div className="px-5 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">

                                    {/* Main Grid: Mobile stacked, MD+ 3 columns */}
                                    <div className="md:grid md:grid-cols-3 md:gap-8 lg:gap-12">

                                        {/* Column 1: Company Info */}
                                        <div className="mb-8 md:mb-0 md:col-span-1">
                                            {/* Logo and Company Name */}
                                            <div className="flex items-center gap-3 mb-5 sm:mb-6">
                                                <Image
                                                    src="/images/logo/logo-prestige-white.svg"
                                                    alt="Prestige Academy Logo"
                                                    width={44}
                                                    height={44}
                                                    className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0"
                                                />
                                                <div className="min-w-0">
                                                    <h3 className="text-white font-bold text-base sm:text-lg">
                                                        Prestige Academy
                                                    </h3>
                                                    <p className="text-white/70 text-xs sm:text-sm">
                                                        PT Prestige Artha Abadi
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-white/80 text-sm leading-relaxed mb-6 hidden sm:block">
                                                Platform tryout ujian modern dengan sistem pengawasan berbasis AI untuk persiapan CPNS terbaik.
                                            </p>

                                            {/* Contact Info */}
                                            <div className="space-y-3 mb-6">
                                                <a
                                                    href="mailto:prestige.co@gmail.com"
                                                    className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group"
                                                >
                                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                                    <span className="text-xs sm:text-sm">prestige.co@gmail.com</span>
                                                </a>
                                                <a
                                                    href="tel:+6281338491615"
                                                    className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group"
                                                >
                                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                                    <span className="text-xs sm:text-sm">+62 813-3849-1615</span>
                                                </a>
                                            </div>

                                            {/* Social Media */}
                                            <div>
                                                <h4 className="text-white font-semibold text-sm sm:text-base mb-3 sm:mb-4">
                                                    Ikuti Kami
                                                </h4>
                                                <div className="flex gap-2 sm:gap-3">
                                                    {socialMedia.map((social, index) => {
                                                        const IconComponent = social.icon;
                                                        return (
                                                            <Link
                                                                key={social.name}
                                                                href={social.href}
                                                                className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-md"
                                                                aria-label={social.name}
                                                                style={{ animationDelay: `${index * 100}ms` }}
                                                            >
                                                                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Column 2 & 3: Links Grid */}
                                        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                                            {/* Layanan */}
                                            <div>
                                                <h4 className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-4 sm:mb-5">
                                                    Layanan
                                                </h4>
                                                <ul className="space-y-3">
                                                    {services.map((item) => (
                                                        <li key={item.label}>
                                                            <Link
                                                                href={item.href}
                                                                className="text-white/80 hover:text-white text-xs sm:text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Informasi */}
                                            <div>
                                                <h4 className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-4 sm:mb-5">
                                                    Informasi
                                                </h4>
                                                <ul className="space-y-3">
                                                    {information.map((item) => (
                                                        <li key={item.label}>
                                                            <Link
                                                                href={item.href}
                                                                className="text-white/80 hover:text-white text-xs sm:text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Legal */}
                                            <div className="col-span-2 sm:col-span-1">
                                                <h4 className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-4 sm:mb-5">
                                                    Legal
                                                </h4>
                                                <ul className="space-y-3">
                                                    {legal.map((item) => (
                                                        <li key={item.label}>
                                                            <Link
                                                                href={item.href}
                                                                className="text-white/80 hover:text-white text-xs sm:text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Copyright Bar */}
                                    <div className="border-t border-white/20 mt-8 sm:mt-10 pt-5 sm:pt-6">
                                        <p className="text-center text-white/70 text-xs sm:text-sm">
                                            © {currentYear} Prestige Academy. Hak cipta dilindungi undang-undang.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;