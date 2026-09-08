import React from 'react';
import { ThemeId } from '../types';
import { THEME_OPTIONS } from '../utils/theme';
import { Palette, Check, X } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] p-6 shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[var(--accent)]" />
            <h3 className="text-xs uppercase tracking-widest font-bold text-[var(--text-main)]">
              Выбор темы оформления
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          Выберите цветовую схему, подходящую под ваше настроение и время суток
        </p>

        <div className="space-y-2.5">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = theme.id === currentTheme;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  onSelectTheme(theme.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--bg-subtle)] shadow-xs'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-card)] hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Color preview orb */}
                  <div
                    className="w-7 h-7 rounded-full border border-black/20 flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: theme.previewColor }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-[var(--text-main)]">
                      {theme.name}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {theme.subtitle}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-[var(--accent-text)] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-subtle)] font-mono">
          <span>Тема сохраняется мгновенно</span>
          <span>5 вариантов</span>
        </div>
      </div>
    </div>
  );
};
