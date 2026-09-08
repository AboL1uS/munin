import React from 'react';
import { RotateCcw, ChevronDown, ChevronUp, Plus, Sparkles, ArrowLeft } from 'lucide-react';
import { TrackerStats } from '../types';

interface HeaderProps {
  activeTrackTitle: string;
  activeTrackCategory: string;
  activeTrackDescription?: string;
  onBackToTracks: () => void;
  stats: TrackerStats;
  allCollapsed: boolean;
  onToggleAllCollapsed: () => void;
  onResetToDefault: () => void;
  onOpenAddTopic: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTrackTitle,
  activeTrackCategory,
  activeTrackDescription,
  onBackToTracks,
  stats,
  allCollapsed,
  onToggleAllCollapsed,
  onResetToDefault,
  onOpenAddTopic,
}) => {
  const isAllComplete = stats.totalTasks > 0 && stats.completedTasks === stats.totalTasks;

  return (
    <header className="mb-10">
      {/* Back button to all tracks */}
      <div className="mb-4">
        <button
          onClick={onBackToTracks}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Все ветки обучения</span>
        </button>
      </div>

      {/* Top bar with title and quick actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] font-semibold px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)] font-mono">
              {activeTrackCategory}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--text-main)]">
            {activeTrackTitle}
          </h1>
          {activeTrackDescription && (
            <p className="text-xs text-[var(--text-muted)] mt-1.5 max-w-2xl leading-relaxed">
              {activeTrackDescription}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            id="toggle-all-topics-btn"
            onClick={onToggleAllCollapsed}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors"
            title={allCollapsed ? "Развернуть все темы" : "Свернуть все темы"}
          >
            {allCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-current" />
                <span>Развернуть все</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-current" />
                <span>Свернуть все</span>
              </>
            )}
          </button>

          <button
            id="add-topic-top-btn"
            onClick={onOpenAddTopic}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-text)] shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Новая тема</span>
          </button>

          <button
            id="reset-tracker-btn"
            onClick={onResetToDefault}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors"
            title="Восстановить темы по умолчанию для этой ветки"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Clean Minimalism Progress Display Card */}
      <div className="mt-8 p-6 sm:p-7 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] font-semibold">
                Прогресс по направлению
              </span>
              {isAllComplete && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent)] text-[var(--accent-text)]">
                  <Sparkles className="w-3 h-3" /> Освоено на 100%
                </span>
              )}
            </div>
            <div className="text-xs text-[var(--text-muted)]">
              {stats.completedTasks} из {stats.totalTasks} задач выполнено · {stats.completedTopics} из {stats.totalTopics} тем закрыто
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-4xl sm:text-5xl font-extralight tracking-tighter text-[var(--text-main)] font-mono">
              {stats.percentage}%
            </div>
          </div>
        </div>

        {/* Ultra-clean Minimalist Progress Bar */}
        <div className="w-full h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-500 ease-out"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>

        {/* Minimalist Stats Strip */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-[var(--border-subtle)]">
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-widest text-[var(--text-subtle)]">Всего задач</div>
            <div className="text-sm font-light text-[var(--text-main)] mt-0.5 font-mono">{stats.totalTasks}</div>
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-widest text-[var(--text-subtle)]">Выполнено</div>
            <div className="text-sm font-light text-[var(--text-main)] mt-0.5 font-mono">{stats.completedTasks}</div>
          </div>
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-widest text-[var(--text-subtle)]">Осталось</div>
            <div className="text-sm font-light text-[var(--text-muted)] mt-0.5 font-mono">{stats.totalTasks - stats.completedTasks}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
