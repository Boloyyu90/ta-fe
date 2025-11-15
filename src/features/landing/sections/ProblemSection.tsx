import { AlertCircle, Clock, TrendingDown, Frown } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/shared/components/animations";

export function ProblemSection() {
    const problems = [
        {
            icon: AlertCircle,
            title: "Exam Anxiety",
            description: "Students face real exams unprepared, leading to panic and underperformance.",
        },
        {
            icon: Clock,
            title: "Time Management",
            description: "Without practice, students struggle with pacing and completing exams on time.",
        },
        {
            icon: TrendingDown,
            title: "Poor Performance Tracking",
            description: "Tutors lack insights into student weaknesses and progress over time.",
        },
        {
            icon: Frown,
            title: "Cheating Concerns",
            description: "Remote practice exams lack proper monitoring, reducing their effectiveness.",
        },
    ];

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="container mx-auto">
                <FadeIn>
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            The Challenge Tutoring Centers Face
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Traditional exam preparation methods leave students unprepared and tutors without the tools they need to
                            track progress effectively.
                        </p>
                    </div>
                </FadeIn>

                <FadeInStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={100} baseDelay={200}>
                    {problems.map((problem, index) => {
                        const Icon = problem.icon;
                        return (
                            <div key={index} className="p-6 rounded-xl bg-card border border-border hover:border-destructive/50 transition-colors">
                                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-destructive" />
                                </div>
                                <h3 className="text-lg font-semibold text-card-foreground mb-2">{problem.title}</h3>
                                <p className="text-sm text-muted-foreground">{problem.description}</p>
                            </div>
                        );
                    })}
                </FadeInStagger>
            </div>
        </section>
    );
}