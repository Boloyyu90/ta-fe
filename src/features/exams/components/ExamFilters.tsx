// src/features/exams/components/ExamFilters.tsx
'use client';

import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';

interface ExamFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE';
    onStatusFilterChange: (value: 'ALL' | 'ACTIVE' | 'INACTIVE') => void;
    onClearFilters: () => void;
    resultsCount: number;
}

export function ExamFilters({
                                searchQuery,
                                onSearchChange,
                                statusFilter,
                                onStatusFilterChange,
                                onClearFilters,
                                resultsCount,
                            }: ExamFiltersProps) {
    const hasActiveFilters = searchQuery !== '' || statusFilter !== 'ALL';

    return (
        <div className="space-y-4">
            {/* Search and Filter Row */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari ujian berdasarkan judul atau deskripsi..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-10"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="iconXs"
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Semua Ujian</SelectItem>
                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                        <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Active Filters & Results Count */}
            {hasActiveFilters && (
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">Filter aktif:</span>

                        {searchQuery && (
                            <Badge variant="secondary" className="gap-1">
                                Pencarian: {searchQuery}
                                <Button
                                    variant="ghost"
                                    size="iconXs"
                                    onClick={() => onSearchChange('')}
                                    className="ml-1 hover:text-foreground h-auto w-auto p-0"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}

                        {statusFilter !== 'ALL' && (
                            <Badge variant="secondary" className="gap-1">
                                Status: {statusFilter}
                                <Button
                                    variant="ghost"
                                    size="iconXs"
                                    onClick={() => onStatusFilterChange('ALL')}
                                    className="ml-1 hover:text-foreground h-auto w-auto p-0"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Hapus semua filter
                    </Button>
                </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {resultsCount} ujian ditemukan
        </span>
            </div>
        </div>
    );
}