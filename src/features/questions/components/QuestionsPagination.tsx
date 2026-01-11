// src/features/questions/components/QuestionsPagination.tsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

interface QuestionsPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function QuestionsPagination({
                                        currentPage,
                                        totalPages,
                                        totalItems,
                                        itemsPerPage,
                                        onPageChange,
                                        onItemsPerPageChange,
                                    }: QuestionsPaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
            {/* Items per page selector */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Tampilkan</span>
                <Select
                    value={String(itemsPerPage)}
                    onValueChange={(value) => onItemsPerPageChange(Number(value))}
                >
                    <SelectTrigger className="w-[70px] h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                </Select>
                <span>per halaman</span>
            </div>

            {/* Pagination info */}
            <div className="text-sm text-muted-foreground">
                Menampilkan {startItem} - {endItem} dari {totalItems} soal
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                    {/* Show page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                            // Show first page, last page, current page, and adjacent pages
                            return (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            );
                        })
                        .map((page, idx, arr) => {
                            // Add ellipsis if there's a gap
                            const prevPage = arr[idx - 1];
                            const showEllipsis = prevPage && page - prevPage > 1;

                            return (
                                <div key={page} className="flex items-center gap-1">
                                    {showEllipsis && (
                                        <span className="px-2 text-muted-foreground">...</span>
                                    )}
                                    <Button
                                        variant={page === currentPage ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => onPageChange(page)}
                                        className="w-8 h-8"
                                    >
                                        {page}
                                    </Button>
                                </div>
                            );
                        })}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}