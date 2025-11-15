import { CheckCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FadeIn } from "@/shared/components/animations";

export function SolutionSection() {
    const benefits = [
        "Realistic exam environment with time constraints",
        "AI-powered proctoring to ensure integrity",
        "Comprehensive analytics and performance insights",
        "Instant feedback on strengths and weaknesses",
        "Question bank management and customization",
        "Centralized dashboard for tutors and students",
    ];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <FadeIn direction="left">
                        <div className="space-y-6">
                            <div className="inline-block">
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-secondary/10 text-secondary border border-secondary/20">
                  Our Solution
                </span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                                Complete Exam Tryout Platform with Intelligence Built-In
                            </h2>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Prestige Tryout combines realistic exam simulation with advanced proctoring and analytics, giving
                                tutoring centers the complete toolset to prepare students for success.
                            </p>

                            <ul className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="text-foreground">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button size="lg" className="mt-4 bg-primary hover:bg-primary-700">
                                Explore Features
                            </Button>
                        </div>
                    </FadeIn>

                    <FadeIn direction="right" delay={200}>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border p-8 flex items-center justify-center">
                                <div className="text-center space-y-6">
                                    <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                                        PT
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-foreground">All-in-One Platform</h3>
                                        <p className="text-muted-foreground">Simulate • Monitor • Analyze</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}