import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-muted border-t border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg" />
                            <span className="text-lg font-bold text-foreground">Prestige Tryout</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Platform tryout ujian modern dengan sistem pengawasan berbasis AI untuk bimbel dan peserta ujian.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Produk</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Fitur
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Harga
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Keamanan
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Integrasi
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Perusahaan</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Tentang Kami
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Karir
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Kontak
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Bantuan</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Pusat Bantuan
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Dokumentasi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Kebijakan Privasi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Syarat & Ketentuan
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Prestige Tryout Platform. Hak cipta dilindungi.
                    </p>
                </div>
            </div>
        </footer>
    );
}