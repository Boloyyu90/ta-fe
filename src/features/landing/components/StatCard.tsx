interface StatCardProps {
    value: string;
    label: string;
}

export function StatCard({ value, label }: StatCardProps) {
    return (
        <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{value}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </div>
    );
}