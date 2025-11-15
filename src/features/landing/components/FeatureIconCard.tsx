import type { LucideIcon } from "lucide-react";

interface FeatureIconCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function FeatureIconCard({ icon: Icon, title, description }: FeatureIconCardProps) {
    return (
        <div className="group p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}