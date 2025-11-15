import { Upload, Play, BarChart, CheckCircle } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/shared/components/animations";

export function HowItWorksSection() {
    const steps = [
        {
            icon: Upload,
            title: "Create Your Exam",
            description: "Upload questions or build from our question bank. Set time limits and configure proctoring settings.",
        },
        {
            icon: Play,
            title: "Students Take Tryout",
            description: "Participants join the exam with webcam monitoring. AI proctoring ensures exam integrity in real-time.",
        },
        {
            icon: BarChart,
            title: "Analyze Results",
            description: "View comprehensive analytics on performance, time management, and areas needing improvement.",
        },
        {
            icon: CheckCircle,
            title: "Improve & Iterate",
            description: "Use insights to refine teaching strategies and help students focus on their weak areas.",
        },
    ];

    return (
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <FadeIn>
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How It Works</h2>
                        <p className="text-lg text-muted-foreground">
                            Get started in minutes with our simple, intuitive workflow designed for tutors and students.
                        </p>
                    </div>
                </FadeIn>

                <FadeInStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={100} baseDelay={200}>
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="relative">
                                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm z-10">
                                    {index + 1}
                                </div>

                                <div className="h-full p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-card-foreground mb-2">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-14 left-full w-8 h-0.5 bg-border -z-10" />
                                )}
                            </div>
                        );
                    })}
                </FadeInStagger>
            </div>
        </section>
    );
}