// src/features/questions/components/QuestionFilters.tsx
'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import type { QuestionType } from '../types/questions.types';

interface QuestionFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    typeFilter: QuestionType | 'ALL';
    onTypeFilterChange: (value: QuestionType | 'ALL') => void;
    onClearFilters: () => void;
    resultsCount: number;
}

export function QuestionFilters({
                                    searchQuery,
                                    onSearchChange,
                                    typeFilter,
                                    onTypeFilterChange,
                                    onClearFilters,
                                    resultsCount,
                                }: QuestionFiltersProps) {
    const hasActiveFilters = searchQuery || typeFilter !== 'ALL';

    return (
        <div className="space-y-4">
            {/* Search and Type Filter */}
            <div className="grid md:grid-cols-[1fr,auto,auto] gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Cari soal..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Type Filter */}
                <Select value={typeFilter} onValueChange={onTypeFilterChange}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Semua Tipe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Semua Tipe</SelectItem>
                        <SelectItem value="TIU">TIU - Tes Intelegensia Umum</SelectItem>
                        <SelectItem value="TWK">TWK - Tes Wawasan Kebangsaan</SelectItem>
                        <SelectItem value="TKP">TKP - Tes Karakteristik Pribadi</SelectItem>
                    </SelectContent>
                </Select>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        className="flex items-center gap-2"
                    >
                        <X className="h-4 w-4" />
                        Hapus
                    </Button>
                )}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    {resultsCount} soal ditemukan
                </span>
            </div>
        </div>
    );
}