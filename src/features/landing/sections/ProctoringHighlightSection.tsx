import { Eye, Camera, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SectionWrapper } from "@/shared/components/SectionWrapper";

export function ProctoringHighlightSection() {
    return (
        <SectionWrapper id="proctoring">
                <div className="relative rounded-3xl bg-gradient-to-br from-primary to-secondary p-1 overflow-hidden">
                    <div className="rounded-3xl bg-background p-8 sm:p-12">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="animate-fade-in-left">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                                        <Shield className="w-4 h-4" />
                                        <span className="text-sm font-medium">Inovasi Unggulan</span>
                                    </div>

                                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                                        Pengawasan Berbasis AI dengan Deteksi YOLO ML
                                    </h2>

                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        Sistem machine learning canggih kami memantau sesi ujian secara real-time, mendeteksi
                                        perilaku mencurigakan dan menjaga integritas ujian tanpa pengawasan yang invasif.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
                                            <Eye className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-1">Pelacakan Pandangan</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Memantau pergerakan mata untuk mendeteksi saat peserta melihat ke luar layar.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
                                            <Camera className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-1">Pengenalan Wajah</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Memverifikasi identitas peserta dan mendeteksi kehadiran orang lain dalam frame.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
                                            <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-1">Analisis Perilaku</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Menandai pola yang tidak biasa dan memberitahu pengawas untuk review manual.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                                        Pelajari Lebih Lanjut
                                    </Button>
                                </div>
                            </div>

                            <div className="animate-fade-in-right" style={{ animationDelay: '150ms' }}>
                                <div className="relative">
                                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-border/50 backdrop-blur-sm flex items-center justify-center">
                                        <div className="text-center space-y-4 p-8">
                                            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl animate-float">
                                                <Shield className="w-16 h-16 text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-foreground">YOLO ML</h3>
                                            <p className="text-muted-foreground">Mesin Deteksi Real-Time</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </SectionWrapper>
    );
}
