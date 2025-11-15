import { TestimonialCard } from "../components/TestimonialCard";
import { FadeIn, FadeInStagger } from "@/shared/components/animations";

export function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Director, Elite Academy",
            content:
                "Prestige Tryout transformed how we prepare students for standardized tests. The AI proctoring gives us confidence in remote exam integrity, and the analytics help us identify exactly where each student needs support.",
            rating: 5,
        },
        {
            name: "Michael Rodriguez",
            role: "SAT Prep Tutor",
            content:
                "My students' scores improved by an average of 150 points after using Prestige Tryout for practice. The realistic exam environment helps reduce test-day anxiety significantly.",
            rating: 5,
        },
        {
            name: "Emily Johnson",
            role: "College Prep Student",
            content:
                "I was nervous about taking the ACT, but after doing multiple tryouts on this platform, I felt completely prepared. The timer and proctoring made it feel like the real thing. Got a 34 on the actual exam!",
            rating: 5,
        },
    ];

    return (
        <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <FadeIn>
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Trusted by Tutors and Students</h2>
                        <p className="text-lg text-muted-foreground">
                            See how Prestige Tryout is helping tutoring centers and students achieve their goals.
                        </p>
                    </div>
                </FadeIn>

                <FadeInStagger className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto" staggerDelay={150} baseDelay={200}>
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={index}
                            name={testimonial.name}
                            role={testimonial.role}
                            content={testimonial.content}
                            rating={testimonial.rating}
                        />
                    ))}
                </FadeInStagger>
            </div>
        </section>
    );
}