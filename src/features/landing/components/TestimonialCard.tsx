import { Star } from "lucide-react";

interface TestimonialCardProps {
    name: string;
    role: string;
    content: string;
    rating: number;
}

export function TestimonialCard({ name, role, content, rating }: TestimonialCardProps) {
    return (
        <div className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                ))}
            </div>
            <p className="text-card-foreground mb-4 leading-relaxed">{content}</p>
            <div>
                <div className="font-semibold text-card-foreground">{name}</div>
                <div className="text-sm text-muted-foreground">{role}</div>
            </div>
        </div>
    );
}