import { Navbar, Footer } from "@/features/landing/components";
import {
    HeroSection,
    AboutSection,
    BenefitsSection,
    FeaturesSection,
    PricingSection,
    TestimonialsSection,
    FaqSection,
    CtaSection,
} from "@/features/landing/sections";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main>
                <HeroSection />
                <AboutSection />
                <BenefitsSection />
                <FeaturesSection />
                <PricingSection />
                <TestimonialsSection />
                <FaqSection />
                <CtaSection />
            </main>
            <Footer />
        </div>
    );
}
