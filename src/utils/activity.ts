import { ActivityMap } from '../types';

export const ACTIVITY_STORAGE_KEY = 'odin_activity_log_v1';

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadActivityLog(): ActivityMap {
  try {
    const saved = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading activity log:', e);
  }

  // Seed sample initial activity over the past 3 weeks to make heatmap feel alive
  const initial: ActivityMap = {};
  const today = new Date();
  const sampleDays = [0, 1, 2, 4, 5, 7, 8, 9, 11, 12, 14, 15, 16, 18, 19, 21];
  sampleDays.forEach((offset) => {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const key = formatDateKey(d);
    // Random 1 to 5 activities
    initial[key] = Math.floor(Math.random() * 4) + 2;
  });

  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(initial));
  } catch {
    // ignore
  }

  return initial;
}

export function saveActivityLog(log: ActivityMap): void {
  try {
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(log));
  } catch (e) {
    console.error('Error saving activity log:', e);
  }
}

export function logActivityIncrement(delta: number = 1): ActivityMap {
  const current = loadActivityLog();
  const today = getTodayKey();
  const nextVal = Math.max(0, (current[today] || 0) + delta);
  current[today] = nextVal;
  saveActivityLog(current);
  return { ...current };
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  totalActions: number;
}

export function calculateStreaks(activity: ActivityMap): StreakStats {
  const dates = Object.keys(activity).sort();
  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalActiveDays: 0, totalActions: 0 };
  }

  const todayStr = getTodayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateKey(yesterday);

  let totalActions = 0;
  let totalActiveDays = 0;
  for (const count of Object.values(activity)) {
    if (count > 0) {
      totalActions += count;
      totalActiveDays += 1;
    }
  }

  // Calculate current streak
  let currentStreak = 0;
  const checkDate = new Date();
  // If today has activity, start from today. Else if yesterday has activity, start from yesterday.
  if ((activity[todayStr] || 0) > 0) {
    // start from today
  } else if ((activity[yesterdayStr] || 0) > 0) {
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // streak broken
    checkDate.setDate(checkDate.getDate() - 1000);
  }

  while (true) {
    const key = formatDateKey(checkDate);
    if ((activity[key] || 0) > 0) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  const sortedDates = Object.keys(activity)
    .filter((k) => activity[k] > 0)
    .sort();

  if (sortedDates.length > 0) {
    tempStreak = 1;
    longestStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 1;
      }
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalActiveDays,
    totalActions,
  };
}
