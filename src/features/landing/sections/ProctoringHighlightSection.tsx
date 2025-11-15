import { Eye, Camera, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FadeIn } from "@/shared/components/animations";

export function ProctoringHighlightSection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="relative rounded-3xl bg-gradient-to-br from-primary to-secondary p-1 overflow-hidden">
                    <div className="rounded-3xl bg-background p-8 sm:p-12">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <FadeIn direction="left">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                                        <Shield className="w-4 h-4" />
                                        <span className="text-sm font-medium">Innovation Highlight</span>
                                    </div>

                                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                                        AI-Powered Proctoring with YOLO ML Detection
                                    </h2>

                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        Our advanced machine learning system monitors exam sessions in real-time, detecting suspicious
                                        behavior and maintaining exam integrity without invasive surveillance.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
                                            <Eye className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-1">Gaze Tracking</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Monitors eye movement to detect when participants look away from the screen.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
                                            <Camera className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-1">Face Recognition</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Verifies participant identity and detects multiple people in frame.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
                                            <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-1">Behavior Analysis</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Flags unusual patterns and alerts proctors for manual review.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                                        Learn More About Proctoring
                                    </Button>
                                </div>
                            </FadeIn>

                            <FadeIn direction="right" delay={200}>
                                <div className="relative">
                                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-border/50 backdrop-blur-sm flex items-center justify-center">
                                        <div className="text-center space-y-4 p-8">
                                            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl animate-float">
                                                <Shield className="w-16 h-16 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-foreground">YOLO ML</h3>
                                            <p className="text-muted-foreground">Real-Time Detection Engine</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}