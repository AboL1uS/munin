import React, { useRef, useState } from 'react';
import { LearningTrack, UserProfile, ActivityMap, ThemeId } from '../types';
import { THEME_OPTIONS } from '../utils/theme';
import { ActivityHeatmap } from './ActivityHeatmap';
import {
  Camera,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  ArrowRight,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Palette,
} from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  tracks: LearningTrack[];
  activity: ActivityMap;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSelectTrack: (trackId: string) => void;
  onExportData: () => void;
  onImportData: (jsonString: string) => void;
  onOpenResetModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  tracks,
  activity,
  currentTheme,
  onSelectTheme,
  onUpdateProfile,
  onSelectTrack,
  onExportData,
  onImportData,
  onOpenResetModal,
}) => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Photo upload handler with client-side thumbnail resizing
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите файл изображения (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onUpdateProfile({ avatar: dataUrl });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onUpdateProfile({ avatar: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim() || 'Студент',
      role: role.trim() || 'Разработчик',
    });
    setIsEditingInfo(false);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportData(content);
      }
    };
    reader.readAsText(file);
  };

  // Overall statistics calculation
  const totalTasks = tracks.reduce(
    (acc, t) => acc + t.topics.reduce((sub, topic) => sub + topic.tasks.length, 0),
    0
  );
  const completedTasks = tracks.reduce(
    (acc, t) =>
      acc +
      t.topics.reduce(
        (sub, topic) => sub + topic.tasks.filter((task) => task.completed).length,
        0
      ),
    0
  );
  const totalTopics = tracks.reduce((acc, t) => acc + t.topics.length, 0);
  const completedTopics = tracks.reduce(
    (acc, t) =>
      acc +
      t.topics.filter(
        (topic) =>
          topic.tasks.length > 0 && topic.tasks.every((task) => task.completed)
      ).length,
    0
  );
  const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar with Photo Upload */}
          <div className="relative group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[var(--bg-subtle)] border-2 border-[var(--border-card)] flex items-center justify-center shadow-2xl">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)]">
                  <span className="text-3xl font-light tracking-tight">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--text-subtle)] mt-1 font-mono">
                    Фото
                  </span>
                </div>
              )}
            </div>

            {/* Photo Action Overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer text-xs gap-1 backdrop-blur-xs"
              title="Загрузить фотографию"
            >
              <Camera className="w-5 h-5 text-white" />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {profile.avatar ? 'Изменить' : 'Загрузить'}
              </span>
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          {/* User Details & Quick Info */}
          <div className="flex-1 text-center sm:text-left">
            {isEditingInfo ? (
              <form onSubmit={handleSaveInfo} className="space-y-3 max-w-md">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-1">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-base bg-[var(--bg-subtle)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-main)] outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-1">
                    Специализация / Роль
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-xs bg-[var(--bg-subtle)] border border-[var(--border-card)] rounded-xl px-3 py-2 text-[var(--text-muted)] outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--accent)] text-[var(--accent-text)] text-xs font-bold uppercase tracking-wider hover:opacity-90"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setName(profile.name);
                      setRole(profile.role);
                      setIsEditingInfo(false);
                    }}
                    className="px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--text-main)]">
                    {profile.name}
                  </h1>
                  <button
                    onClick={() => setIsEditingInfo(true)}
                    className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg transition-colors"
                    title="Редактировать имя и статус"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-mono mt-1">
                  {profile.role}
                </div>

                {/* Photo controls */}
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-4 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                    <span>{profile.avatar ? 'Сменить фото' : 'Загрузить фото'}</span>
                  </button>

                  {profile.avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 rounded transition-colors"
                      title="Удалить аватар"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Overall Completion Circle / Metric */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] min-w-[140px]">
            <div className="text-3xl sm:text-4xl font-light font-mono text-[var(--text-main)] tracking-tight">
              {overallPercentage}%
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono mt-1 text-center">
              Общий прогресс
            </div>
          </div>
        </div>
      </div>

      {/* Global Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-4 rounded-2xl transition-colors">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono">
            Веток обучения
          </div>
          <div className="text-2xl font-light text-[var(--text-main)] mt-1">{tracks.length}</div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-4 rounded-2xl transition-colors">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono">
            Тем завершено
          </div>
          <div className="text-2xl font-light text-[var(--text-main)] mt-1">
            {completedTopics} <span className="text-xs text-[var(--text-subtle)]">/ {totalTopics}</span>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-4 rounded-2xl transition-colors">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono">
            Задач выполнено
          </div>
          <div className="text-2xl font-light text-[var(--text-main)] mt-1">
            {completedTasks} <span className="text-xs text-[var(--text-subtle)]">/ {totalTasks}</span>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-4 rounded-2xl transition-colors">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono">
            Статус студента
          </div>
          <div className="text-xs font-semibold text-[var(--text-main)] mt-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{overallPercentage === 100 ? 'Все ветки закрыты' : 'В процессе обучения'}</span>
          </div>
        </div>
      </div>

      {/* Streak Heatmap Calendar */}
      <ActivityHeatmap activity={activity} />

      {/* Theme Selection Section */}
      <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--text-main)]">
              Цветовая тема приложения
            </h3>
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            5 вариантов
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {THEME_OPTIONS.map((t) => {
            const isSelected = t.id === currentTheme;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTheme(t.id)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--bg-subtle)] shadow-xs scale-102'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-card)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: t.previewColor }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: t.accentColor }}
                    />
                  </div>
                  {isSelected && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--accent)] text-[var(--accent-text)]">
                      Активна
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[var(--text-main)]">{t.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)] truncate">{t.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Track-by-Track Progress Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider font-bold text-[var(--text-main)]">
            Прогресс по каждой ветке обучения
          </h2>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {tracks.length} направлений
          </span>
        </div>

        <div className="space-y-3">
          {tracks.map((track) => {
            const trackTotal = track.topics.reduce(
              (acc, top) => acc + top.tasks.length,
              0
            );
            const trackDone = track.topics.reduce(
              (acc, top) =>
                acc + top.tasks.filter((t) => t.completed).length,
              0
            );
            const percent =
              trackTotal > 0 ? Math.round((trackDone / trackTotal) * 100) : 0;
            const isFinished = trackTotal > 0 && trackDone === trackTotal;

            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track.id)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] transition-all cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-mono bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {track.category}
                    </span>
                    {isFinished && (
                      <span className="flex items-center gap-1 text-[9px] uppercase font-bold text-[var(--accent-text)] bg-[var(--accent)] px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Освоено
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-medium text-[var(--text-main)] transition-colors truncate">
                    {track.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
                    {track.description}
                  </p>
                </div>

                {/* Progress bar and counter */}
                <div className="flex items-center gap-5 sm:min-w-[240px] justify-between sm:justify-end">
                  <div className="flex flex-col items-start sm:items-end flex-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-main)]">
                      <span>{percent}%</span>
                      <span className="text-[var(--text-muted)]">
                        ({trackDone}/{trackTotal} задач)
                      </span>
                    </div>
                    <div className="w-full sm:w-36 h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full bg-[var(--accent)] transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors pl-2">
                    <span className="hidden sm:inline">Открыть</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Management, Export & Backup */}
      <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] space-y-4 transition-colors">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-[var(--text-main)]">
              Экспорт и резервное копирование
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Сохраните прогресс в JSON-файл или восстановите на другом компьютере
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onExportData}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Скачать копию (.json)</span>
            </button>

            <button
              onClick={() => importInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-medium transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Восстановить (.json)</span>
            </button>

            <input
              ref={importInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              className="hidden"
            />

            <button
              onClick={onOpenResetModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[var(--text-muted)] hover:text-rose-400 transition-colors"
              title="Сбросить все данные трекера к исходным"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Сбросить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
