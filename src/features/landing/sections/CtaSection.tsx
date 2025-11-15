import { Button } from "@/shared/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { FadeIn } from "@/shared/components/animations";

export function CtaSection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <FadeIn>
                    <div className="relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary animate-gradient-x" />

                        <div className="relative px-8 py-16 sm:px-12 sm:py-20 text-center">
                            <div className="max-w-3xl mx-auto space-y-8">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                                    Ready to Transform Your Exam Preparation?
                                </h2>

                                <p className="text-lg text-white/90 leading-relaxed">
                                    Join thousands of tutoring centers and students who are achieving better results with realistic exam
                                    simulations and AI-powered proctoring.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <Button size="lg" variant="secondary" className="group min-w-[200px]">
                                        Start Free Tryout
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="min-w-[200px] bg-white/10 border-white/20 text-white hover:bg-white/20"
                                    >
                                        <Mail className="mr-2 w-5 h-5" />
                                        Book a Demo
                                    </Button>
                                </div>

                                <div className="pt-8">
                                    <p className="text-sm text-white/80">14-day free trial • No credit card required • Cancel anytime</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}