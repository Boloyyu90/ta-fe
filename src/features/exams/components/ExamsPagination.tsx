// src/features/exams/components/ExamsPagination.tsx
'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';

interface ExamsPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

export function ExamsPagination({
                                    currentPage,
                                    totalPages,
                                    totalItems,
                                    itemsPerPage,
                                    onPageChange,
                                    onItemsPerPageChange,
                                }: ExamsPaginationProps) {
    // Calculate visible page range
    const getPageNumbers = () => {
        const delta = 2; // Pages to show on each side of current page
        const range: (number | string)[] = [];
        const rangeWithDots: (number | string)[] = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const pageNumbers = getPageNumbers();

    if (totalPages <= 1) {
        return null;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Item per halaman:</span>
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
                >
                    <SelectTrigger className="w-[80px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="12">12</SelectItem>
                        <SelectItem value="24">24</SelectItem>
                        <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Page info */}
            <div className="text-sm text-muted-foreground">
                Menampilkan {startItem} - {endItem} dari {totalItems} hasil
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
                {/* First page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                    {pageNumbers.map((pageNum, index) => {
                        if (pageNum === '...') {
                            return (
                                <span key={`dots-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
                            );
                        }

                        return (
                            <Button
                                key={pageNum}
                                variant={pageNum === currentPage ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => onPageChange(pageNum as number)}
                                className="w-10"
                            >
                                {pageNum}
                            </Button>
                        );
                    })}
                </div>

                {/* Next page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last page */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}