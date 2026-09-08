import React from 'react';
import { Search, X, Layers, Clock, CheckCircle } from 'lucide-react';
import { FilterType } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  counts: {
    all: number;
    inProgress: number;
    completed: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  counts,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id="task-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск по темам, задачам или коду (Scanner, extends...)"
          className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-[var(--bg-card)] border border-[var(--border-card)] rounded-full text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-full"
            title="Очистить поиск"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-full self-start sm:self-auto">
        <button
          id="filter-all-btn"
          onClick={() => onFilterChange('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs transition-all rounded-full ${
            filter === 'all'
              ? 'bg-[var(--accent)] text-[var(--accent-text)] font-bold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] font-medium'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Все ({counts.all})</span>
        </button>

        <button
          id="filter-in-progress-btn"
          onClick={() => onFilterChange('in_progress')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs transition-all rounded-full ${
            filter === 'in_progress'
              ? 'bg-[var(--accent)] text-[var(--accent-text)] font-bold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] font-medium'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>В процессе ({counts.inProgress})</span>
        </button>

        <button
          id="filter-completed-btn"
          onClick={() => onFilterChange('completed')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs transition-all rounded-full ${
            filter === 'completed'
              ? 'bg-[var(--accent)] text-[var(--accent-text)] font-bold shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)] font-medium'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Готово ({counts.completed})</span>
        </button>
      </div>
    </div>
  );
};
