import { FeatureIconCard } from "../components/FeatureIconCard";
import { FileText, Shield, BarChart3, Users, Clock, Database } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/shared/components/animations";

export function FeaturesSection() {
    const features = [
        {
            icon: FileText,
            title: "Exam Creation",
            description: "Build custom exams with our intuitive question bank. Support for multiple choice, essays, and more.",
        },
        {
            icon: Shield,
            title: "AI Proctoring",
            description: "YOLO-based ML detection for cheating prevention. Monitor participants in real-time with confidence.",
        },
        {
            icon: BarChart3,
            title: "Performance Analytics",
            description: "Detailed insights into student performance, question difficulty, and progress tracking over time.",
        },
        {
            icon: Users,
            title: "Multi-User Management",
            description: "Separate portals for tutors and participants with role-based access and permissions.",
        },
        {
            icon: Clock,
            title: "Timed Simulations",
            description: "Replicate real exam conditions with strict time limits and countdown timers for authentic practice.",
        },
        {
            icon: Database,
            title: "Question Bank",
            description: "Organize and manage thousands of questions by topic, difficulty, and exam type.",
        },
    ];

    return (
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="container mx-auto">
                <FadeIn>
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Everything You Need in One Platform
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Comprehensive features designed for tutoring centers and serious exam preparation.
                        </p>
                    </div>
                </FadeIn>

                <FadeInStagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={100} baseDelay={200}>
                    {features.map((feature, index) => (
                        <FeatureIconCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
                    ))}
                </FadeInStagger>
            </div>
        </section>
    );
}