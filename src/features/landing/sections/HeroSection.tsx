import { Button } from "@/shared/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import Image from "next/image";
import { FadeIn } from "@/shared/components/animations";

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-10" />

            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <FadeIn delay={100}>
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 inline-block">
                AI-Powered Exam Simulation
              </span>
                        </FadeIn>

                        <FadeIn delay={200}>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                Serious Exam Simulation
                                <span className="block text-primary mt-2">Without the Panic</span>
                            </h1>
                        </FadeIn>

                        <FadeIn delay={300}>
                            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                                Complete exam tryout platform with AI-powered proctoring, real-time analytics, and comprehensive
                                performance insights for tutoring centers and exam participants.
                            </p>
                        </FadeIn>

                        <FadeIn delay={400}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="group bg-primary hover:bg-primary-700 transition-smooth">
                                    Start Free Tryout
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button size="lg" variant="outline" className="group border-primary text-primary hover:bg-primary/10">
                                    <PlayCircle className="mr-2 w-5 h-5" />
                                    Watch Demo
                                </Button>
                            </div>
                        </FadeIn>

                        <FadeIn delay={500}>
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                                <div>
                                    <div className="text-2xl font-bold text-foreground">10K+</div>
                                    <div className="text-sm text-muted-foreground">Active Users</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">50K+</div>
                                    <div className="text-sm text-muted-foreground">Exams Completed</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">98%</div>
                                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    <FadeIn direction="right" delay={600}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl -z-10 animate-pulse-subtle" />
                            <Image
                                src="/images/hero-illustration.png"
                                alt="Prestige Tryout Platform Interface"
                                width={600}
                                height={450}
                                className="w-full h-auto rounded-2xl shadow-2xl"
                                priority
                            />
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}