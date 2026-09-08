import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LearningTrack, ThemeId, AppView } from '../types';
import { THEME_OPTIONS } from '../utils/theme';
import {
  Search,
  Layers,
  CheckCircle2,
  Circle,
  Clock,
  Palette,
  User,
  Download,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: LearningTrack[];
  onSelectTrack: (trackId: string) => void;
  onSelectView: (view: AppView) => void;
  onOpenPomodoro: () => void;
  onSetTheme: (themeId: ThemeId) => void;
  onExportData: () => void;
}

interface SearchItem {
  id: string;
  type: 'action' | 'track' | 'topic' | 'task';
  title: string;
  subtitle?: string;
  badge?: string;
  completed?: boolean;
  trackId?: string;
  action?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tracks,
  onSelectTrack,
  onSelectView,
  onOpenPomodoro,
  onSetTheme,
  onExportData,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Generate searchable items
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result: SearchItem[] = [];

    // 1. Quick Actions
    const quickActions: SearchItem[] = [
      {
        id: 'action-pomodoro',
        type: 'action',
        title: 'Запустить таймер фокуса (Pomodoro)',
        subtitle: '25 минут концентрированной учебы',
        action: () => {
          onClose();
          onOpenPomodoro();
        },
      },
      {
        id: 'action-profile',
        type: 'action',
        title: 'Перейти в профиль студента',
        subtitle: 'Статистика, серия дней и настройки',
        action: () => {
          onClose();
          onSelectView('profile');
        },
      },
      {
        id: 'action-tracks',
        type: 'action',
        title: 'Все ветки обучения (Главная)',
        subtitle: 'Список роадмапов и направлений',
        action: () => {
          onClose();
          onSelectView('tracks');
        },
      },
      {
        id: 'action-export',
        type: 'action',
        title: 'Экспорт резервной копии (.json)',
        subtitle: 'Сохранить весь прогресс в файл',
        action: () => {
          onClose();
          onExportData();
        },
      },
    ];

    // Theme switches
    THEME_OPTIONS.forEach((theme) => {
      quickActions.push({
        id: `action-theme-${theme.id}`,
        type: 'action',
        title: `Тема: ${theme.name}`,
        subtitle: theme.subtitle,
        badge: 'Оформление',
        action: () => {
          onSetTheme(theme.id);
          onClose();
        },
      });
    });

    if (!q) {
      // If query is empty, show top actions and tracks
      result.push(...quickActions);
      tracks.forEach((track) => {
        result.push({
          id: `track-${track.id}`,
          type: 'track',
          title: track.title,
          subtitle: track.description,
          badge: track.category,
          trackId: track.id,
          action: () => {
            onClose();
            onSelectTrack(track.id);
          },
        });
      });
      return result.slice(0, 15);
    }

    // Filter quick actions
    quickActions.forEach((act) => {
      if (act.title.toLowerCase().includes(q) || act.subtitle?.toLowerCase().includes(q)) {
        result.push(act);
      }
    });

    // Search Tracks
    tracks.forEach((track) => {
      const matchTrack =
        track.title.toLowerCase().includes(q) ||
        track.description.toLowerCase().includes(q) ||
        track.category.toLowerCase().includes(q);

      if (matchTrack) {
        result.push({
          id: `track-${track.id}`,
          type: 'track',
          title: track.title,
          subtitle: track.description,
          badge: track.category,
          trackId: track.id,
          action: () => {
            onClose();
            onSelectTrack(track.id);
          },
        });
      }

      // Search Topics inside Track
      track.topics.forEach((topic) => {
        if (topic.title.toLowerCase().includes(q)) {
          const totalTasks = topic.tasks.length;
          const completedTasks = topic.tasks.filter((t) => t.completed).length;
          result.push({
            id: `topic-${topic.id}`,
            type: 'topic',
            title: topic.title,
            subtitle: `Ветка: ${track.title} (${completedTasks}/${totalTasks} задач)`,
            badge: 'Тема',
            trackId: track.id,
            action: () => {
              onClose();
              onSelectTrack(track.id);
            },
          });
        }

        // Search Tasks
        topic.tasks.forEach((task) => {
          if (task.title.toLowerCase().includes(q)) {
            result.push({
              id: `task-${task.id}`,
              type: 'task',
              title: task.title,
              subtitle: `${track.title} → ${topic.title}`,
              badge: task.completed ? 'Выполнено' : 'Задача',
              completed: task.completed,
              trackId: track.id,
              action: () => {
                onClose();
                onSelectTrack(track.id);
              },
            });
          }
        });
      });
    });

    return result.slice(0, 30);
  }, [query, tracks, onSelectTrack, onSelectView, onOpenPomodoro, onSetTheme, onExportData, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (items.length > 0 ? (prev + 1) % items.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (items.length > 0 ? (prev - 1 + items.length) % items.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedIndex]?.action) {
          items[selectedIndex].action!();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, selectedIndex, onClose]);

  // Auto scroll to active item
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)]">
          <Search className="w-5 h-5 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Поиск тем, задач, веток или команд... (Ctrl+K)"
            className="flex-1 bg-transparent text-[var(--text-main)] text-sm sm:text-base outline-none placeholder:text-[var(--text-subtle)]"
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-muted)]">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 scrollbar-thin max-h-[55vh]"
        >
          {items.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-muted)] space-y-2">
              <Compass className="w-8 h-8 mx-auto opacity-40 text-[var(--text-subtle)]" />
              <p className="text-sm">Ничего не найдено по запросу &laquo;{query}&raquo;</p>
              <p className="text-xs text-[var(--text-subtle)]">
                Попробуйте найти по ключевым словам: Java, Spring, Помидоро, Тема, SQL
              </p>
            </div>
          ) : (
            items.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action && item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[var(--accent)] text-[var(--accent-text)]'
                      : 'hover:bg-[var(--bg-card-hover)] text-[var(--text-main)]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Icon by Type */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-black/15 text-current'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                      }`}
                    >
                      {item.type === 'action' && <Palette className="w-3.5 h-3.5" />}
                      {item.type === 'track' && <Layers className="w-3.5 h-3.5" />}
                      {item.type === 'topic' && <Compass className="w-3.5 h-3.5" />}
                      {item.type === 'task' &&
                        (item.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Circle className="w-3.5 h-3.5" />
                        ))}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span
                            className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono shrink-0 ${
                              isSelected
                                ? 'bg-black/20 text-current'
                                : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p
                          className={`text-[11px] truncate mt-0.5 ${
                            isSelected ? 'opacity-80' : 'text-[var(--text-muted)]'
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-5 py-2.5 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Навигация</span>
            <span>↵ Выбрать</span>
            <span>ESC Закрыть</span>
          </div>
          <span>Munin</span>
        </div>
      </div>
    </div>
  );
};
