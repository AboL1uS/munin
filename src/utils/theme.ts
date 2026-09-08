import { ThemeId } from '../types';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  subtitle: string;
  previewColor: string;
  accentColor: string;
  isDark: boolean;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'dark',
    name: 'Тёмная',
    subtitle: 'Обсидиан & Воронье перо',
    previewColor: '#050505',
    accentColor: '#ffffff',
    isDark: true,
  },
  {
    id: 'light',
    name: 'Светлая',
    subtitle: 'Чистая бумага & Чернила',
    previewColor: '#f8f9fa',
    accentColor: '#111827',
    isDark: false,
  },
  {
    id: 'rose',
    name: 'Нежно-розовая',
    subtitle: 'Цветущая сакура',
    previewColor: '#fdf5f6',
    accentColor: '#d9466f',
    isDark: false,
  },
  {
    id: 'navy',
    name: 'Тёмно-синяя',
    subtitle: 'Северный полуночный океан',
    previewColor: '#060d17',
    accentColor: '#38bdf8',
    isDark: true,
  },
  {
    id: 'beige',
    name: 'Пастельно-бежевая',
    subtitle: 'Тёплый латте & Пергамент',
    previewColor: '#fbf7f0',
    accentColor: '#8c6338',
    isDark: false,
  },
];

export const THEME_STORAGE_KEY = 'odin_study_theme_id';
