/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import {
  LearningTrack,
  TopicGroup,
  TaskItem,
  FilterType,
  TrackerStats,
  AppView,
  UserProfile,
  ThemeId,
  ActivityMap,
} from './types';
import { INITIAL_TRACKS, INITIAL_PROFILE } from './data/initialData';
import { THEME_STORAGE_KEY } from './utils/theme';
import { loadActivityLog, logActivityIncrement, saveActivityLog } from './utils/activity';
import { Navbar } from './components/Navbar';
import { TracksView } from './components/TracksView';
import { ProfileView } from './components/ProfileView';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { TopicCard } from './components/TopicCard';
import { AddTopicModal } from './components/AddTopicModal';
import { AddTrackModal } from './components/AddTrackModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { CommandPalette } from './components/CommandPalette';
import { PomodoroWidget } from './components/PomodoroWidget';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';

const TRACKS_STORAGE_KEY = 'study_tracker_tracks_v2';
const PROFILE_STORAGE_KEY = 'study_tracker_profile_v2';
const ACTIVE_TRACK_STORAGE_KEY = 'study_tracker_active_track_id';
const LEGACY_STORAGE_KEY = 'java_study_tracker_data_v1';

export default function App() {
  // 1. Theme State
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && ['dark', 'light', 'rose', 'navy', 'beige'].includes(saved)) {
        return saved as ThemeId;
      }
    } catch {
      // ignore
    }
    return 'dark';
  });

  // Apply theme to root document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch (e) {
      console.error('Error saving theme:', e);
    }
  }, [currentTheme]);

  // 2. Activity / Streak log
  const [activity, setActivity] = useState<ActivityMap>(() => loadActivityLog());

  // 3. Learning tracks state
  const [tracks, setTracks] = useState<LearningTrack[]>(() => {
    try {
      const saved = localStorage.getItem(TRACKS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading tracks data:', e);
    }
    return INITIAL_TRACKS;
  });

  // 4. Active track selection
  const [activeTrackId, setActiveTrackId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_TRACK_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '';
  });

  // 5. User profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_PROFILE, ...parsed };
      }
    } catch (e) {
      console.error('Error loading profile data:', e);
    }
    return INITIAL_PROFILE;
  });

  // 6. Current view
  const [currentView, setCurrentView] = useState<AppView>('tracks');

  // 7. Filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [quickTaskText, setQuickTaskText] = useState('');

  // 8. Modals & Widgets state
  const [isAddTrackModalOpen, setIsAddTrackModalOpen] = useState(false);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TRACKS_STORAGE_KEY, JSON.stringify(tracks));
    } catch (e) {
      console.error('Error saving tracks:', e);
    }
  }, [tracks]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_TRACK_STORAGE_KEY, activeTrackId);
    } catch (e) {
      console.error('Error saving active track id:', e);
    }
  }, [activeTrackId]);

  // Derive active track safely
  const activeTrack = useMemo(() => {
    if (tracks.length === 0) return null;
    return tracks.find((t) => t.id === activeTrackId) || tracks[0] || null;
  }, [tracks, activeTrackId]);

  // Keep view consistent if active track is deleted or unavailable
  useEffect(() => {
    if (currentView === 'track_detail' && !activeTrack) {
      setCurrentView('tracks');
    }
  }, [currentView, activeTrack]);

  // Overall statistics for all tracks
  const globalStats = useMemo(() => {
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
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { totalTasks, completedTasks, percentage };
  }, [tracks]);

  // Active track specific statistics
  const activeTrackStats: TrackerStats = useMemo(() => {
    if (!activeTrack) {
      return { totalTopics: 0, completedTopics: 0, totalTasks: 0, completedTasks: 0, percentage: 0 };
    }
    const topics = activeTrack.topics;
    const totalTopics = topics.length;
    let totalTasks = 0;
    let completedTasks = 0;
    let completedTopics = 0;

    topics.forEach((topic) => {
      const tTasks = topic.tasks.length;
      const tCompleted = topic.tasks.filter((t) => t.completed).length;
      totalTasks += tTasks;
      completedTasks += tCompleted;
      if (tTasks > 0 && tCompleted === tTasks) {
        completedTopics += 1;
      }
    });

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTopics,
      completedTopics,
      totalTasks,
      completedTasks,
      percentage,
    };
  }, [activeTrack]);

  // Filter counts for active track
  const filterCounts = useMemo(() => {
    if (!activeTrack) return { all: 0, inProgress: 0, completed: 0 };
    const topics = activeTrack.topics;
    let inProgress = 0;
    let completed = 0;

    topics.forEach((topic) => {
      const tTasks = topic.tasks.length;
      const tCompleted = topic.tasks.filter((t) => t.completed).length;
      if (tTasks > 0 && tCompleted === tTasks) {
        completed += 1;
      } else {
        inProgress += 1;
      }
    });

    return {
      all: topics.length,
      inProgress,
      completed,
    };
  }, [activeTrack]);

  // Filtered topics for active track
  const filteredTopics = useMemo(() => {
    if (!activeTrack) return [];
    let list = [...activeTrack.topics];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter((topic) => {
        const titleMatch = topic.title.toLowerCase().includes(query);
        const taskMatch = topic.tasks.some((t) => t.title.toLowerCase().includes(query));
        return titleMatch || taskMatch;
      });
    }

    if (filter === 'completed') {
      list = list.filter(
        (topic) => topic.tasks.length > 0 && topic.tasks.every((t) => t.completed)
      );
    } else if (filter === 'in_progress') {
      list = list.filter(
        (topic) => topic.tasks.length === 0 || topic.tasks.some((t) => !t.completed)
      );
    }

    return list;
  }, [activeTrack, searchQuery, filter]);

  const allCollapsed = useMemo(() => {
    if (!activeTrack || activeTrack.topics.length === 0) return false;
    return activeTrack.topics.every((t) => t.isCollapsed);
  }, [activeTrack]);

  // Helper to update topics inside the active track
  const updateActiveTrackTopics = useCallback(
    (updater: (prevTopics: TopicGroup[]) => TopicGroup[]) => {
      if (!activeTrack) return;
      setTracks((prev) =>
        prev.map((track) => {
          if (track.id === activeTrack.id) {
            return {
              ...track,
              topics: updater(track.topics),
              updatedAt: Date.now(),
            };
          }
          return track;
        })
      );
    },
    [activeTrack]
  );

  // --- Track Management Handlers ---
  const handleSelectTrack = (trackId: string) => {
    setActiveTrackId(trackId);
    setCurrentView('track_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddTrack = (
    title: string,
    category: string,
    description: string,
    initialTopics?: TopicGroup[]
  ) => {
    const newTrackId = `track-${Date.now()}`;
    const newTrack: LearningTrack = {
      id: newTrackId,
      title,
      category,
      description,
      topics: initialTopics || [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setTracks((prev) => [...prev, newTrack]);
    setActiveTrackId(newTrackId);
    setCurrentView('track_detail');
  };

  const handleDeleteTrack = (trackId: string) => {
    setTracks((prev) => {
      const remaining = prev.filter((t) => t.id !== trackId);
      if (activeTrackId === trackId) {
        if (remaining.length > 0) {
          setActiveTrackId(remaining[0].id);
        } else {
          setActiveTrackId('');
          setCurrentView('tracks');
        }
      }
      return remaining;
    });
  };

  const handleEditTrack = (trackId: string, newTitle: string, newDescription: string) => {
    setTracks((prev) =>
      prev.map((t) =>
        t.id === trackId
          ? { ...t, title: newTitle, description: newDescription, updatedAt: Date.now() }
          : t
      )
    );
  };

  // --- Profile Handlers ---
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // --- Topic & Task Handlers (within Active Track) ---
  const handleToggleTask = (topicId: string, taskId: string) => {
    let nowCompleted = false;
    updateActiveTrackTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) return topic;
        return {
          ...topic,
          tasks: topic.tasks.map((task) => {
            if (task.id === taskId) {
              const nextVal = !task.completed;
              nowCompleted = nextVal;
              return { ...task, completed: nextVal };
            }
            return task;
          }),
        };
      })
    );

    // If marked completed, increment activity streak
    if (nowCompleted) {
      const updatedActivity = logActivityIncrement(1);
      setActivity(updatedActivity);
    }
  };

  const handleDeleteTask = (topicId: string, taskId: string) => {
    updateActiveTrackTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) return topic;
        return {
          ...topic,
          tasks: topic.tasks.filter((task) => task.id !== taskId),
        };
      })
    );
  };

  const handleEditTask = (topicId: string, taskId: string, newTitle: string) => {
    updateActiveTrackTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) return topic;
        return {
          ...topic,
          tasks: topic.tasks.map((task) =>
            task.id === taskId ? { ...task, title: newTitle } : task
          ),
        };
      })
    );
  };

  const handleAddTask = (topicId: string, title: string) => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title,
      completed: false,
      createdAt: Date.now(),
    };

    updateActiveTrackTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) return topic;
        return {
          ...topic,
          tasks: [...topic.tasks, newTask],
        };
      })
    );
  };

  const handleToggleTopicAllTasks = (topicId: string) => {
    let markedSome = false;
    updateActiveTrackTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) return topic;
        const allDone = topic.tasks.length > 0 && topic.tasks.every((t) => t.completed);
        if (!allDone) markedSome = true;
        return {
          ...topic,
          tasks: topic.tasks.map((t) => ({ ...t, completed: !allDone })),
        };
      })
    );

    if (markedSome) {
      const updatedActivity = logActivityIncrement(2);
      setActivity(updatedActivity);
    }
  };

  const handleDeleteTopic = (topicId: string) => {
    updateActiveTrackTopics((prev) => prev.filter((t) => t.id !== topicId));
  };

  const handleEditTopicTitle = (topicId: string, newTitle: string) => {
    updateActiveTrackTopics((prev) =>
      prev.map((topic) => (topic.id === topicId ? { ...topic, title: newTitle } : topic))
    );
  };

  const handleToggleCollapse = (topicId: string) => {
    updateActiveTrackTopics((prev) =>
      prev.map((topic) =>
        topic.id === topicId ? { ...topic, isCollapsed: !topic.isCollapsed } : topic
      )
    );
  };

  const handleToggleAllCollapsed = () => {
    const targetState = !allCollapsed;
    updateActiveTrackTopics((prev) =>
      prev.map((t) => ({
        ...t,
        isCollapsed: targetState,
      }))
    );
  };

  const handleAddTopic = (title: string, initialTaskTitles: string[]) => {
    const newTopic: TopicGroup = {
      id: `topic-${Date.now()}`,
      title,
      tasks: initialTaskTitles.map((taskTitle, idx) => ({
        id: `task-${Date.now()}-${idx}`,
        title: taskTitle,
        completed: false,
        createdAt: Date.now() + idx,
      })),
      isCollapsed: false,
    };
    updateActiveTrackTopics((prev) => [...prev, newTopic]);
  };

  const handleQuickAddObjective = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = quickTaskText.trim();
    if (!clean || !activeTrack) return;

    if (activeTrack.topics.length === 0) {
      handleAddTopic('ТЕМА 1: Начало практики', [clean]);
    } else {
      const lastTopic = activeTrack.topics[activeTrack.topics.length - 1];
      handleAddTask(lastTopic.id, clean);
    }
    setQuickTaskText('');
  };

  // Pomodoro completed handler
  const handlePomodoroFocusCompleted = () => {
    const updated = logActivityIncrement(1);
    setActivity(updated);
  };

  // Reset current active track topics or factory reset
  const handleResetCurrentTrack = () => {
    if (!activeTrack) return;
    updateActiveTrackTopics((prev) =>
      prev.map((t) => ({
        ...t,
        tasks: t.tasks.map((task) => ({ ...task, completed: false })),
      }))
    );
  };

  const handleResetAllData = () => {
    setTracks([]);
    setProfile(INITIAL_PROFILE);
    setActiveTrackId('');
    localStorage.removeItem(TRACKS_STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_TRACK_STORAGE_KEY);
    setCurrentView('tracks');
  };

  // Backup export / import
  const handleExportData = () => {
    const backup = {
      appName: 'Munin',
      version: 3,
      exportedAt: new Date().toISOString(),
      theme: currentTheme,
      activity,
      profile,
      tracks,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `odin_study_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.tracks && Array.isArray(data.tracks)) {
        setTracks(data.tracks);
        if (data.profile) setProfile(data.profile);
        if (data.theme && ['dark', 'light', 'rose', 'navy', 'beige'].includes(data.theme)) {
          setCurrentTheme(data.theme);
        }
        if (data.activity) {
          setActivity(data.activity);
          saveActivityLog(data.activity);
        }
        alert('Данные успешно импортированы!');
      } else {
        alert('Некорректный формат файла резервной копии.');
      }
    } catch {
      alert('Ошибка при чтении JSON-файла.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans flex flex-col selection:bg-[var(--accent)] selection:text-[var(--accent-text)] transition-colors">
      {/* Universal Clean Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        activeTrack={activeTrack}
        tracksCount={tracks.length}
        profile={profile}
        overallPercent={globalStats.percentage}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenPomodoro={() => setIsPomodoroOpen(true)}
        onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
        currentTheme={currentTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col">
        {/* VIEW 1: All Learning Tracks (Dashboard / Branches Menu) */}
        {currentView === 'tracks' && (
          <TracksView
            tracks={tracks}
            onSelectTrack={handleSelectTrack}
            onOpenAddTrackModal={() => setIsAddTrackModalOpen(true)}
            onDeleteTrack={handleDeleteTrack}
            onEditTrack={handleEditTrack}
          />
        )}

        {/* VIEW 2: Active Track Detail Roadmap */}
        {currentView === 'track_detail' && activeTrack && (
          <div className="flex-1 flex flex-col animate-fadeIn">
            {/* Header */}
            <Header
              activeTrackTitle={activeTrack.title}
              activeTrackCategory={activeTrack.category}
              activeTrackDescription={activeTrack.description}
              onBackToTracks={() => setCurrentView('tracks')}
              stats={activeTrackStats}
              allCollapsed={allCollapsed}
              onToggleAllCollapsed={handleToggleAllCollapsed}
              onResetToDefault={() => setIsResetModalOpen(true)}
              onOpenAddTopic={() => setIsAddTopicModalOpen(true)}
            />

            {/* Filter & Search Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filter={filter}
              onFilterChange={setFilter}
              counts={filterCounts}
            />

            {/* Milestone Banner if Track is 100% completed */}
            {activeTrackStats.totalTasks > 0 &&
              activeTrackStats.completedTasks === activeTrackStats.totalTasks && (
                <div className="mb-8 p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-main)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-[var(--accent-text)] flex items-center justify-center font-bold shadow-xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium tracking-tight text-[var(--text-main)]">
                        {activeTrack.title} — 100% Освоено!
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        Все этапы и практические задания в этой ветке успешно завершены.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAddTopicModalOpen(true)}
                    className="bg-[var(--accent)] text-[var(--accent-text)] text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full hover:opacity-90 transition-colors self-start sm:self-auto shadow-xs"
                  >
                    Новая тема
                  </button>
                </div>
              )}

            {/* Topics responsive grid */}
            <div className="flex-1">
              {filteredTopics.length === 0 ? (
                <div className="text-center py-20 px-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)]">
                  <AlertCircle className="w-6 h-6 text-[var(--text-muted)] mx-auto mb-2" />
                  <p className="text-[var(--text-main)] font-light text-sm">Ничего не найдено</p>
                  <p className="text-[var(--text-muted)] text-xs mt-1">
                    {searchQuery
                      ? `По запросу «${searchQuery}» совпадений нет.`
                      : 'Нет тем, соответствующих выбранному фильтру.'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 px-4 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors"
                    >
                      Сбросить поиск
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
                  {filteredTopics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                      onToggleTask={handleToggleTask}
                      onDeleteTask={handleDeleteTask}
                      onEditTask={handleEditTask}
                      onAddTask={handleAddTask}
                      onToggleTopicAllTasks={handleToggleTopicAllTasks}
                      onDeleteTopic={handleDeleteTopic}
                      onEditTopicTitle={handleEditTopicTitle}
                      onToggleCollapse={handleToggleCollapse}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Quick Add Objective Bar */}
            <footer className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 bg-[var(--bg-card)] p-2 sm:pl-6 rounded-3xl border border-[var(--border-card)] shadow-lg transition-colors">
              <form onSubmit={handleQuickAddObjective} className="flex-1 flex items-center">
                <input
                  type="text"
                  value={quickTaskText}
                  onChange={(e) => setQuickTaskText(e.target.value)}
                  placeholder={`Добавить практическую задачу в «${activeTrack.title}»...`}
                  className="bg-transparent flex-1 px-3 sm:px-0 text-xs sm:text-sm text-[var(--text-main)] outline-none placeholder:text-[var(--text-subtle)]"
                />
              </form>
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleQuickAddObjective}
                  disabled={!quickTaskText.trim()}
                  className="bg-[var(--accent)] disabled:opacity-30 text-[var(--accent-text)] text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full hover:opacity-90 transition-colors shadow-xs"
                >
                  Добавить
                </button>
                <button
                  type="button"
                  id="add-topic-bottom-btn"
                  onClick={() => setIsAddTopicModalOpen(true)}
                  className="bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] border border-[var(--border-subtle)] text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full transition-colors whitespace-nowrap"
                >
                  + Тема
                </button>
              </div>
            </footer>
          </div>
        )}

        {/* VIEW 3: Student Profile */}
        {currentView === 'profile' && (
          <ProfileView
            profile={profile}
            tracks={tracks}
            activity={activity}
            currentTheme={currentTheme}
            onSelectTheme={setCurrentTheme}
            onUpdateProfile={handleUpdateProfile}
            onSelectTrack={handleSelectTrack}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onOpenResetModal={() => setIsResetModalOpen(true)}
          />
        )}
      </main>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tracks={tracks}
        onSelectTrack={handleSelectTrack}
        onSelectView={setCurrentView}
        onOpenPomodoro={() => setIsPomodoroOpen(true)}
        onSetTheme={setCurrentTheme}
        onExportData={handleExportData}
      />

      {/* Pomodoro Focus Timer */}
      <PomodoroWidget
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        onFocusSessionCompleted={handlePomodoroFocusCompleted}
      />

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
      />

      {/* Modals */}
      <AddTrackModal
        isOpen={isAddTrackModalOpen}
        onClose={() => setIsAddTrackModalOpen(false)}
        onAddTrack={handleAddTrack}
      />

      {activeTrack && (
        <AddTopicModal
          isOpen={isAddTopicModalOpen}
          onClose={() => setIsAddTopicModalOpen(false)}
          onAddTopic={handleAddTopic}
          currentTopicCount={activeTrack.topics.length}
        />
      )}

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={currentView === 'profile' ? handleResetAllData : handleResetCurrentTrack}
      />
    </div>
  );
}
