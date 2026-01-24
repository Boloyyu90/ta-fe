'use client';

import Link from 'next/link';
import {ShoppingCart, Package, ArrowRight, Info, Search} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
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
            <Card className="text-center py-16">
                <CardHeader className="pb-4">
                    <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4">
                        <ShoppingCart className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Fitur Segera Hadir</CardTitle>
                    <CardDescription className="max-w-sm mx-auto text-base">
                        Fitur keranjang belanja sedang dalam pengembangan.
                        Saat ini Anda dapat langsung membeli paket dari halaman detail.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild size="lg" variant="secondary">
                            <Link href="/exams">
                                <Package className="mr-2 h-4 w-4" />
                                Lihat Pilihan Paket
                            </Link>
                        </Button>
                        <Button variant="default" size="lg" asChild>
                            <Link href="/my-packages">
                                Paket Saya
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
