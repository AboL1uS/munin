import React from 'react';
import { AppView, LearningTrack, UserProfile, ThemeId } from '../types';
import { Layers, User, ChevronRight, Search, Palette, Timer } from 'lucide-react';
import { RavenLogo } from './RavenLogo';

interface NavbarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  activeTrack: LearningTrack | null;
  tracksCount: number;
  profile: UserProfile;
  overallPercent: number;
  onOpenCommandPalette: () => void;
  onOpenPomodoro: () => void;
  onOpenThemeSelector: () => void;
  currentTheme: ThemeId;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  activeTrack,
  tracksCount,
  profile,
  overallPercent,
  onOpenCommandPalette,
  onOpenPomodoro,
  onOpenThemeSelector,
}) => {
  return (
    <header className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-nav)] backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand / Raven Logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => onSelectView('tracks')}
            className="flex items-center group text-left focus:outline-none p-1 rounded-2xl transition-transform hover:scale-105"
            title="Перейти к списку веток"
            aria-label="Ветки обучения"
          >
            <div className="w-9 h-9 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] group-hover:border-[var(--border-card-hover)] flex items-center justify-center text-[var(--text-main)] transition-colors shadow-xs">
              <RavenLogo className="w-6 h-6" />
            </div>
          </button>

          {/* Breadcrumb or View Nav */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs">
            <button
              onClick={() => onSelectView('tracks')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                currentView === 'tracks'
                  ? 'bg-[var(--accent)] text-[var(--accent-text)] font-semibold shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Ветки обучения</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  currentView === 'tracks'
                    ? 'bg-black/15 text-current'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {tracksCount}
              </span>
            </button>

            {activeTrack && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-subtle)]" />
                <button
                  onClick={() => onSelectView('track_detail')}
                  className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 truncate max-w-[200px] ${
                    currentView === 'track_detail'
                      ? 'bg-[var(--accent)] text-[var(--accent-text)] font-semibold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                  }`}
                  title={activeTrack.title}
                >
                  <span className="truncate">{activeTrack.title}</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Center/Right Actions: Quick Search, Timer Icon, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Search Button (Ctrl+K) */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-all text-xs"
            title="Быстрый поиск (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-xs">Поиск...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono rounded bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-subtle)]">
              Ctrl+K
            </kbd>
          </button>

          {/* Pomodoro Focus Timer Button - pure icon without text as requested */}
          <button
            onClick={onOpenPomodoro}
            className="p-2 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-all"
            title="Таймер"
            aria-label="Таймер"
          >
            <Timer className="w-3.5 h-3.5" />
          </button>

          {/* Theme Selector Button */}
          <button
            onClick={onOpenThemeSelector}
            className="p-2 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors"
            title="Сменить тему оформления"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>

          {/* Mobile tracks icon */}
          <button
            onClick={() => onSelectView('tracks')}
            className={`md:hidden p-2 rounded-full transition-colors border border-[var(--border-subtle)] ${
              currentView === 'tracks'
                ? 'bg-[var(--accent)] text-[var(--accent-text)]'
                : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
            }`}
            title="Ветки"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Profile Button */}
          <button
            onClick={() => onSelectView('profile')}
            className={`flex items-center gap-2 p-1 pl-2.5 rounded-full border transition-all ${
              currentView === 'profile'
                ? 'bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)] font-medium shadow-xs'
                : 'bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-main)] border-[var(--border-subtle)]'
            }`}
            title="Профиль и статистика"
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-[11px] font-medium leading-tight truncate max-w-[90px]">
                {profile.name}
              </span>
              <span className="text-[9px] opacity-75 font-mono leading-none mt-0.5">
                {overallPercent}% готово
              </span>
            </div>

            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-7 h-7 rounded-full object-cover border border-black/10"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  currentView === 'profile'
                    ? 'bg-black/20 text-current'
                    : 'bg-[var(--bg-card)] text-[var(--text-main)]'
                }`}
              >
                {profile.name.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
