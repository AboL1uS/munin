import React, { useState } from 'react';
import { X, Plus, GitBranch, Sparkles } from 'lucide-react';
import { TopicGroup } from '../types';

interface AddTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrack: (title: string, category: string, description: string, initialTopics?: TopicGroup[]) => void;
}

export const AddTrackModal: React.FC<AddTrackModalProps> = ({
  isOpen,
  onClose,
  onAddTrack,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend & Web');
  const [description, setDescription] = useState('');
  const [withTemplate, setWithTemplate] = useState(true);

  if (!isOpen) return null;

  const categories = [
    'Frontend & Web',
    'Backend & Core',
    'Mobile Development',
    'DevOps & Cloud',
    'Data Science & AI',
    'Computer Science',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    let initialTopics: TopicGroup[] | undefined = undefined;
    if (withTemplate) {
      initialTopics = [
        {
          id: `topic-${Date.now()}-1`,
          title: `ТЕМА 1: Основы и синтаксис (${cleanTitle})`,
          tasks: [
            { id: `task-${Date.now()}-1`, title: 'Установка окружения и запуск первой программы', completed: false, createdAt: Date.now() },
            { id: `task-${Date.now()}-2`, title: 'Базовые типы данных и переменные', completed: false, createdAt: Date.now() + 1 },
            { id: `task-${Date.now()}-3`, title: 'Условные операторы и циклы', completed: false, createdAt: Date.now() + 2 },
            { id: `task-${Date.now()}-4`, title: 'Функции, методы и структуры данных', completed: false, createdAt: Date.now() + 3 },
          ],
        },
        {
          id: `topic-${Date.now()}-2`,
          title: `ТЕМА 2: Продвинутые концепции и архитектура`,
          tasks: [
            { id: `task-${Date.now()}-5`, title: 'Объектно-ориентированное программирование / Модульность', completed: false, createdAt: Date.now() + 4 },
            { id: `task-${Date.now()}-6`, title: 'Работа с исключениями и обработка ошибок', completed: false, createdAt: Date.now() + 5 },
            { id: `task-${Date.now()}-7`, title: 'Асинхронность и работа с файлами/сетью', completed: false, createdAt: Date.now() + 6 },
          ],
        },
        {
          id: `topic-${Date.now()}-3`,
          title: `ТЕМА 3: Итоговая практическая работа и проект`,
          tasks: [
            { id: `task-${Date.now()}-8`, title: 'Проектирование архитектуры приложения', completed: false, createdAt: Date.now() + 7 },
            { id: `task-${Date.now()}-9`, title: 'Реализация основного функционала и тестов', completed: false, createdAt: Date.now() + 8 },
            { id: `task-${Date.now()}-10`, title: 'Развертывание и код-ревью', completed: false, createdAt: Date.now() + 9 },
          ],
        },
      ];
    }

    onAddTrack(
      cleanTitle,
      category,
      description.trim() || 'Индивидуальный роадмап изучения и практических заданий',
      initialTopics
    );

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] p-6 sm:p-7 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)]">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-medium tracking-tight text-[var(--text-main)]">
              Создать новую ветку обучения
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Направление для структурирования тем и практических заданий
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-2">
              Название ветки
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Изучение JavaScript (или Python, DevOps...)"
              required
              autoFocus
              className="w-full text-xs sm:text-sm bg-[var(--bg-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent)] rounded-2xl px-4 py-2.5 text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-2">
              Категория
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    category === cat
                      ? 'bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)] font-medium shadow-xs'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-2">
              Краткое описание (цель)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Освоение современного стека, практические работы и пет-проект"
              className="w-full text-xs sm:text-sm bg-[var(--bg-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent)] rounded-2xl px-4 py-2.5 text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none transition-colors"
            />
          </div>

          {/* Template checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] cursor-pointer">
              <input
                type="checkbox"
                checked={withTemplate}
                onChange={(e) => setWithTemplate(e.target.checked)}
                className="mt-0.5 rounded border-[var(--border-card)] text-[var(--accent)] focus:ring-0 accent-[var(--accent)]"
              />
              <div>
                <div className="text-xs font-medium text-[var(--text-main)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Добавить базовый план тем и подзадач</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Создаст 3 темы с начальными пунктами, которые вы сможете изменить под себя
                </p>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[var(--accent)] hover:opacity-90 disabled:opacity-30 text-[var(--accent-text)] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Создать ветку</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
