'use client';

/**
 * Cart Page - Placeholder
 *
 * Fitur keranjang belum tersedia karena sistem menggunakan
 * direct purchase model (1 transaksi = 1 paket).
 *
 * Halaman ini menampilkan info bahwa fitur segera hadir dan
 * memberikan panduan cara membeli paket.
 */

import Link from 'next/link';
import {ShoppingCart, Package, ArrowRight, Info, Search} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import {Input} from "@/shared/components/ui/input";
import { PageHeaderTitle } from '@/shared/components/PageHeaderTitle';
import {useState} from "react";

export default function CartPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    return (
        <div className="container mx-auto py-8 space-y-6">
            <PageHeaderTitle title="Keranjang" />

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari ujian..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* ========== Coming Soon Card ========== */}
            <Card className="text-center mb-8">
                <CardHeader className="pb-4">
                    <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                        <ShoppingCart className="h-12 w-12 text-primary/60" />
                    </div>
                    <CardTitle className="text-2xl">Fitur Segera Hadir</CardTitle>
                    <CardDescription className="max-w-sm mx-auto text-base">
                        Fitur keranjang belanja sedang dalam pengembangan.
                        Saat ini Anda dapat langsung membeli paket dari halaman detail.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild size="lg">
                            <Link href="/exams">
                                <Package className="mr-2 h-4 w-4" />
                                Lihat Pilihan Paket
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/my-packages">
                                Paket Saya
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* ========== How to Buy Guide ========== */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Cara Membeli Paket
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-4">
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                                1
                            </span>
                            <div>
                                <p className="font-medium">Buka Pilihan Paket</p>
                                <p className="text-sm text-muted-foreground">
                                    Lihat semua paket ujian yang tersedia di{' '}
                                    <Link href="/exams" className="text-primary hover:underline">
                                        halaman Pilihan Paket
                                    </Link>
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                                2
                            </span>
                            <div>
                                <p className="font-medium">Pilih Paket yang Diinginkan</p>
                                <p className="text-sm text-muted-foreground">
                                    Klik pada paket untuk melihat detail lengkap termasuk jumlah soal, durasi, dan harga
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                                3
                            </span>
                            <div>
                                <p className="font-medium">Klik Tombol Beli</p>
                                <p className="text-sm text-muted-foreground">
                                    Pada halaman detail paket, klik tombol &quot;Beli&quot; untuk memulai pembayaran
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                                4
                            </span>
                            <div>
                                <p className="font-medium">Selesaikan Pembayaran</p>
                                <p className="text-sm text-muted-foreground">
                                    Pilih metode pembayaran dan selesaikan transaksi melalui Midtrans
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500/10 text-green-600 font-semibold flex items-center justify-center text-sm">
                                &#x2713;
                            </span>
                            <div>
                                <p className="font-medium">Paket Siap Digunakan</p>
                                <p className="text-sm text-muted-foreground">
                                    Setelah pembayaran berhasil, paket akan langsung tersedia di{' '}
                                    <Link href="/my-packages" className="text-primary hover:underline">
                                        Paket Saya
                                    </Link>
                                </p>
                            </div>
                        </li>
                    </ol>
                </CardContent>
            </Card>

            {/* ========== Info Alert ========== */}
            <Alert className="mt-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                    Pembayaran diproses dengan aman melalui Midtrans. Kami mendukung berbagai metode pembayaran termasuk transfer bank, e-wallet, dan kartu kredit.
                </AlertDescription>
            </Alert>
        </div>
    );
}
