export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface TopicGroup {
  id: string;
  title: string;
  tasks: TaskItem[];
  isCollapsed?: boolean;
}

export interface LearningTrack {
  id: string;
  title: string;
  category: string;
  description: string;
  topics: TopicGroup[];
  createdAt: number;
  updatedAt?: number;
}

export interface UserProfile {
  name: string;
  role: string;
  avatar: string | null;
  joinedAt: number;
}

export type AppView = 'tracks' | 'track_detail' | 'profile';

export type FilterType = 'all' | 'in_progress' | 'completed';

export type ThemeId = 'dark' | 'light' | 'rose' | 'navy' | 'beige';

export type PomodoroMode = 'focus' | 'short_break' | 'long_break';

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  count: number;
}

export type ActivityMap = Record<string, number>;

export interface TrackerStats {
  totalTopics: number;
  completedTopics: number;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
}

