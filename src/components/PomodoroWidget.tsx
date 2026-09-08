import React, { useState, useEffect, useRef } from 'react';
import { PomodoroMode } from '../types';
import { playChime } from '../utils/pomodoroAudio';
import { Play, Pause, RotateCcw, Coffee, Sparkles, X, Plus, Minus } from 'lucide-react';

interface PomodoroWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onFocusSessionCompleted: () => void;
}

const MODE_DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

export const PomodoroWidget: React.FC<PomodoroWidgetProps> = ({
  isOpen,
  onClose,
  onFocusSessionCompleted,
}) => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('odin_pomodoro_completed_today');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const lastTickRef = useRef<number>(Date.now());

  // Switch mode
  const switchMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_DURATIONS[newMode]);
  };

  // Adjust time (+/- 5 minutes)
  const adjustMinutes = (deltaMinutes: number) => {
    setTimeLeft((prev) => Math.max(60, prev + deltaMinutes * 60));
  };

  // Reset current timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
  };

  // Timer loop with drift correction
  useEffect(() => {
    if (!isRunning) return;

    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaSeconds = Math.round((now - lastTickRef.current) / 1000);
      lastTickRef.current = now;

      setTimeLeft((prev) => {
        const nextTime = prev - deltaSeconds;
        if (nextTime <= 0) {
          // Timer finished
          playChime(mode !== 'focus');
          if (mode === 'focus') {
            onFocusSessionCompleted();
            setCompletedSessions((c) => {
              const updated = c + 1;
              try {
                localStorage.setItem('odin_pomodoro_completed_today', updated.toString());
              } catch {
                // ignore
              }
              return updated;
            });
            // Auto switch to short break
            setMode('short_break');
            return MODE_DURATIONS.short_break;
          } else {
            // Break finished, switch to focus
            setMode('focus');
            return MODE_DURATIONS.focus;
          }
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, onFocusSessionCompleted]);

  // Sync document title while running
  useEffect(() => {
    if (isRunning) {
      const m = Math.floor(timeLeft / 60);
      const s = String(timeLeft % 60).padStart(2, '0');
      const modeLabel = mode === 'focus' ? 'Фокус' : 'Отдых';
      document.title = `(${m}:${s}) ${modeLabel} — Munin`;
    } else {
      document.title = 'Munin';
    }
  }, [isRunning, timeLeft, mode]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');
  const totalDuration = MODE_DURATIONS[mode];
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] p-6 shadow-2xl space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🍅</span>
            <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--text-main)]">
              Таймер глубокого фокуса
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
          <button
            onClick={() => switchMode('focus')}
            className={`py-1.5 text-xs font-semibold rounded-xl transition-all ${
              mode === 'focus'
                ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Фокус 25м
          </button>
          <button
            onClick={() => switchMode('short_break')}
            className={`py-1.5 text-xs font-semibold rounded-xl transition-all ${
              mode === 'short_break'
                ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Отдых 5м
          </button>
          <button
            onClick={() => switchMode('long_break')}
            className={`py-1.5 text-xs font-semibold rounded-xl transition-all ${
              mode === 'long_break'
                ? 'bg-[var(--accent)] text-[var(--accent-text)] shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Пауза 15м
          </button>
        </div>

        {/* Timer Display with Circular SVG Progress */}
        <div className="relative flex flex-col items-center justify-center py-4">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="86"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-[var(--border-subtle)]"
            />
            <circle
              cx="96"
              cy="96"
              r="86"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 86}
              strokeDashoffset={2 * Math.PI * 86 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="text-[var(--accent)] transition-all duration-500"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl sm:text-5xl font-mono font-light tracking-tight text-[var(--text-main)]">
              {minutes}:{seconds}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono mt-1">
              {mode === 'focus' ? 'Сессия обучения' : 'Восстановление сил'}
            </span>
          </div>
        </div>

        {/* Adjust Time Quick Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => adjustMinutes(-5)}
            disabled={timeLeft <= 300}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs border border-[var(--border-subtle)] transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Отнять 5 минут"
          >
            <Minus className="w-3 h-3" />
            <span>5 мин</span>
          </button>
          <button
            onClick={() => adjustMinutes(5)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs border border-[var(--border-subtle)] transition-colors"
            title="Добавить 5 минут"
          >
            <Plus className="w-3 h-3" />
            <span>5 мин</span>
          </button>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-text)] text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Пауза</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Начать фокус</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors"
            title="Сбросить таймер"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Footer info: streak sync notice */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Сессий за сегодня: <strong className="text-[var(--text-main)]">{completedSessions}</strong>
          </span>
          <span className="text-[10px] text-[var(--text-subtle)] font-mono">
            +1 в стрик активности
          </span>
        </div>
      </div>
    </div>
  );
};
