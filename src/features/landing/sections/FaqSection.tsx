'use client';

import { useState } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Section } from '@/shared/core/section';
import { Animate } from '@/shared/core/animate';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<string | null>('faq1');

  const faqs: FAQ[] = [
    {
      id: 'faq1',
      question: 'Bagaimana cara membuat akun di Prestige Academy?',
      answer: 'Kamu bisa klik tombol Daftar, lalu mengisi form yang telah disediakan.'
    },
    {
      id: 'faq2',
      question: 'Berapa lama masa berlaku paket yang saya beli?',
      answer: 'Masa berlaku paket bervariasi tergantung jenis paket yang dipilih. Paket gratis berlaku 30 hari, sedangkan paket premium berlaku 6-12 bulan.'
    },
    {
      id: 'faq3',
      question: 'Paket belajarnya bisa buat fresh graduate ngga ya?',
      answer: 'Tentu saja! Paket belajar kami dirancang khusus untuk fresh graduate dan cocok untuk semua level, dari pemula hingga mahir.'
    },
    {
      id: 'faq4',
      question: 'Pembayaran bisa melalui media apa aja sih?',
      answer: 'Kami menerima berbagai metode pembayaran seperti transfer bank, e-wallet (GoPay, OVO, DANA), dan kartu kredit/debit.'
    },
    {
      id: 'faq5',
      question: 'Apakah Prestige Academy bisa diakses lewat smartphone?',
      answer: 'Ya, platform kami fully responsive dan bisa diakses melalui smartphone, tablet, maupun desktop dengan pengalaman yang optimal.'
    },
    {
      id: 'faq6',
      question: 'Saya lupa akun password, bagaimana recoverynya?',
      answer: 'Kamu bisa klik "Lupa Password" di halaman login, lalu ikuti instruksi reset password yang dikirim ke email terdaftar.'
    }
  ];

  const toggleFaq = (faqId: string) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <Section id="faq" variant="default" padding="default" container="narrow">
      <Animate animation="fadeInUp">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-bold mb-4">
            <span className="text-3xl sm:text-4xl md:text-4xl text-foreground">
              Pertanyaan Seputar Prestige Academy
            </span>
          </h2>
        </div>
      </Animate>

      <div className="space-y-3 pb-12">
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className="animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="group">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="will-change-transform"
              >
                <Card className={cn(
                  "border overflow-hidden transition-colors duration-fast",
                  openFaq === faq.id
                    ? "border-primary shadow-md bg-primary/5"
                    : "border-border bg-card hover:shadow-sm hover:border-primary/30"
                )}>

                  <motion.button
                    className="w-full p-4 md:p-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-lg"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={openFaq === faq.id}
                    whileHover={{ backgroundColor: "rgba(var(--primary-rgb), 0.02)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className={cn(
                      "pr-4 leading-snug transition-colors duration-fast font-medium",
                      openFaq === faq.id ? "text-primary" : "text-foreground"
                    )}>
                      {faq.question}
                    </span>

                    <div className={cn(
                      "flex-shrink-0 transition-transform duration-fast",
                      openFaq === faq.id ? "rotate-180" : "rotate-0"
                    )}>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-colors duration-fast",
                        openFaq === faq.id ? "text-primary" : "text-muted-foreground"
                      )} />
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {openFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          ease: [0.25, 0.46, 0.45, 0.94],
                          opacity: { duration: 0.25 }
                        }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          exit={{ y: -10 }}
                          transition={{ duration: 0.25, delay: 0.1 }}
                          className="px-4 md:px-5 pb-4 md:pb-5"
                        >
                          <div className="pt-3 border-t border-primary/20">
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default FaqSection;
