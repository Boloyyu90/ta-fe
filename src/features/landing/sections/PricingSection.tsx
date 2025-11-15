import { Button } from "@/shared/components/ui/button";
import { Check } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/shared/components/animations";

export function PricingSection() {
    const plans = [
        {
            name: "Starter",
            price: "$29",
            period: "per month",
            description: "Perfect for individual tutors",
            features: [
                "Up to 50 students",
                "100 exam attempts/month",
                "Basic proctoring",
                "Standard analytics",
                "Email support",
            ],
            cta: "Start Free Trial",
            popular: false,
        },
        {
            name: "Professional",
            price: "$99",
            period: "per month",
            description: "Ideal for small tutoring centers",
            features: [
                "Up to 200 students",
                "500 exam attempts/month",
                "Advanced AI proctoring",
                "Detailed analytics",
                "Priority support",
                "Custom question banks",
            ],
            cta: "Start Free Trial",
            popular: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "contact sales",
            description: "For large institutions",
            features: [
                "Unlimited students",
                "Unlimited exams",
                "Full AI proctoring suite",
                "Advanced analytics & reporting",
                "Dedicated support",
                "Custom integrations",
                "White-label options",
            ],
            cta: "Contact Sales",
            popular: false,
        },
    ];

    return (
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="container mx-auto">
                <FadeIn>
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-lg text-muted-foreground">
                            Choose the plan that fits your needs. All plans include a 14-day free trial.
                        </p>
                    </div>
                </FadeIn>

                <FadeInStagger className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" staggerDelay={150} baseDelay={200}>
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                                plan.popular
                                    ? "border-primary bg-card shadow-xl ring-2 ring-primary/20"
                                    : "border-border bg-card hover:border-primary/50"
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-card-foreground mb-2">{plan.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                    <span className="text-muted-foreground">/{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-card-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className={`w-full ${plan.popular ? "bg-primary hover:bg-primary-700" : ""}`}
                                variant={plan.popular ? "default" : "outline"}
                                size="lg"
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </FadeInStagger>

                <FadeIn delay={800}>
                    <p className="text-center text-sm text-muted-foreground mt-12">
                        All plans include SSL encryption, data backups, and GDPR compliance.
                        <a href="#" className="text-primary hover:underline ml-1">
                            View detailed comparison →
                        </a>
                    </p>
                </FadeIn>
            </div>
        </section>
    );
}