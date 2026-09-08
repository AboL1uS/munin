import React, { useState, useMemo } from 'react';
import { ActivityMap } from '../types';
import { calculateStreaks, formatDateKey } from '../utils/activity';
import { Flame, Zap, Calendar, Award } from 'lucide-react';

interface ActivityHeatmapProps {
  activity: ActivityMap;
}

const RUSSIAN_MONTHS = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
];

const RUSSIAN_DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ activity }) => {
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const streakStats = useMemo(() => calculateStreaks(activity), [activity]);

  // Generate 26 weeks (182 days) up to today
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    // End with current week's Sunday or Saturday
    const endDate = new Date(today);
    
    // We want 26 weeks
    const totalWeeks = 26;
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (totalWeeks * 7 - 1));
    
    // Adjust startDate so it begins on Monday (1)
    const dayOfWeek = startDate.getDay(); // 0 is Sunday, 1 is Monday
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + diffToMonday);

    const generatedWeeks: Array<Array<{ date: Date; dateKey: string; count: number; isFuture: boolean }>> = [];
    const months: Array<{ label: string; weekIndex: number }> = [];
    
    let currentWeek: Array<{ date: Date; dateKey: string; count: number; isFuture: boolean }> = [];
    let currentMonth = -1;
    let iterDate = new Date(startDate);
    let weekCounter = 0;

    while (iterDate <= endDate || currentWeek.length > 0) {
      const dateKey = formatDateKey(iterDate);
      const count = activity[dateKey] || 0;
      const isFuture = iterDate > today;

      const m = iterDate.getMonth();
      if (m !== currentMonth && currentWeek.length === 0 && !isFuture) {
        currentMonth = m;
        months.push({ label: RUSSIAN_MONTHS[m], weekIndex: weekCounter });
      }

      currentWeek.push({
        date: new Date(iterDate),
        dateKey,
        count: isFuture ? 0 : count,
        isFuture,
      });

      if (currentWeek.length === 7) {
        generatedWeeks.push(currentWeek);
        currentWeek = [];
        weekCounter++;
      }

      iterDate.setDate(iterDate.getDate() + 1);
      if (weekCounter >= totalWeeks && currentWeek.length === 0) break;
    }

    return { weeks: generatedWeeks, monthLabels: months };
  }, [activity]);

  const getHeatColorClass = (count: number, isFuture: boolean) => {
    if (isFuture) return 'opacity-20 pointer-events-none';
    if (count === 0) return 'bg-[var(--heat-0)]';
    if (count <= 2) return 'bg-[var(--heat-1)]';
    if (count <= 4) return 'bg-[var(--heat-2)]';
    if (count <= 7) return 'bg-[var(--heat-3)]';
    return 'bg-[var(--heat-4)] shadow-xs';
  };

  const formatDisplayDate = (dateKey: string) => {
    const parts = dateKey.split('-');
    if (parts.length !== 3) return dateKey;
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return `${day} ${RUSSIAN_MONTHS[monthIndex]} ${year}`;
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-5 transition-colors relative overflow-hidden">
      {/* Top Section: Title & Streaks */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm uppercase tracking-widest font-bold text-[var(--text-main)] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--accent)]" />
              <span>Календарь активности & Серии (Streaks)</span>
            </h2>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Каждое закрытое задание или сессия фокуса оставляет след в памяти воронов
          </p>
        </div>

        {/* Streak Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                Серия дней
              </span>
              <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                {streakStats.currentStreak} {streakStats.currentStreak === 1 ? 'день' : streakStats.currentStreak >= 2 && streakStats.currentStreak <= 4 ? 'дня' : 'дней'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <Zap className="w-4 h-4 text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                Лучшая серия
              </span>
              <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                {streakStats.longestStreak} дн.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <Award className="w-4 h-4 text-[var(--accent)]" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">
                Всего действий
              </span>
              <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                {streakStats.totalActions}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid Container */}
      <div className="overflow-x-auto pb-2 scrollbar-thin">
        <div className="min-w-[660px]">
          {/* Month Labels Row */}
          <div className="flex text-[10px] font-mono text-[var(--text-subtle)] mb-1.5 pl-6 gap-2">
            {monthLabels.map((m, idx) => (
              <div
                key={idx}
                style={{ marginLeft: idx === 0 ? `${m.weekIndex * 15}px` : undefined }}
                className="w-12 truncate"
              >
                {m.label}
              </div>
            ))}
          </div>

          {/* Grid with Weekday Labels on Left */}
          <div className="flex items-start gap-2">
            {/* Weekday Labels (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between h-[96px] text-[9px] font-mono text-[var(--text-subtle)] pr-1 select-none">
              <span>Пн</span>
              <span>Ср</span>
              <span>Пт</span>
            </div>

            {/* Columns of 7 days */}
            <div className="flex gap-[3.5px]">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3.5px]">
                  {week.map((day) => {
                    const isHovered = hoveredCell?.date === day.dateKey;
                    return (
                      <div
                        key={day.dateKey}
                        onMouseEnter={(e) => {
                          if (day.isFuture) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          setHoveredCell({
                            date: day.dateKey,
                            count: day.count,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          });
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`w-3 h-3 rounded-[3px] transition-all cursor-pointer ${getHeatColorClass(
                          day.count,
                          day.isFuture
                        )} ${isHovered ? 'ring-2 ring-[var(--accent)] scale-125 z-10' : ''}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
        <span className="font-mono">
          Активных дней: <strong className="text-[var(--text-main)]">{streakStats.totalActiveDays}</strong> за последние 6 месяцев
        </span>

        <div className="flex items-center gap-1.5">
          <span>Меньше</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--heat-0)] inline-block border border-[var(--border-subtle)]" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--heat-1)] inline-block" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--heat-2)] inline-block" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--heat-3)] inline-block" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--heat-4)] inline-block" />
          </div>
          <span>Больше</span>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredCell && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 px-3 py-1.5 rounded-xl bg-[var(--text-main)] text-[var(--accent-text)] text-[11px] font-mono shadow-2xl transition-all"
          style={{
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y - 8}px`,
          }}
        >
          <div className="font-bold whitespace-nowrap">
            {hoveredCell.count === 0
              ? 'Нет активности'
              : `${hoveredCell.count} ${
                  hoveredCell.count === 1
                    ? 'действие'
                    : hoveredCell.count >= 2 && hoveredCell.count <= 4
                    ? 'действия'
                    : 'действий'
                }`}
          </div>
          <div className="opacity-80 text-[9px]">{formatDisplayDate(hoveredCell.date)}</div>
        </div>
      )}
    </div>
  );
};
