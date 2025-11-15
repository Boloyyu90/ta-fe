import { Navbar, Footer } from "@/features/landing/components";
import {
    HeroSection,
    ProblemSection,
    SolutionSection,
    FeaturesSection,
    ProctoringHighlightSection,
    HowItWorksSection,
    PricingSection,
    TestimonialsSection,
    CtaSection,
} from "@/features/landing/sections";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main>
                <HeroSection />
                <ProblemSection />
                <SolutionSection />
                <FeaturesSection />
                <ProctoringHighlightSection />
                <HowItWorksSection />
                <PricingSection />
                <TestimonialsSection />
                <CtaSection />
            </main>
            <Footer />
        </div>
    );
}