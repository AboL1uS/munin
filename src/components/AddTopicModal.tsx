import React, { useState } from 'react';
import { X, Plus, Layers } from 'lucide-react';

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTopic: (title: string, taskTitles: string[]) => void;
  currentTopicCount: number;
}

export const AddTopicModal: React.FC<AddTopicModalProps> = ({
  isOpen,
  onClose,
  onAddTopic,
  currentTopicCount,
}) => {
  const [title, setTitle] = useState(`ТЕМА ${currentTopicCount + 1}: `);
  const [tasksText, setTasksText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const tasks = tasksText
      .split('\n')
      .map((t) => t.replace(/^[-*•\d.)\]\[]+\s*/, '').trim())
      .filter((t) => t.length > 0);

    onAddTopic(trimmedTitle, tasks);
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
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-medium tracking-tight text-[var(--text-main)]">Добавить новую тему</h2>
            <p className="text-xs text-[var(--text-muted)]">Создайте этап изучения и перечень подзадач</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-2">
              Название темы
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ТЕМА 4: Коллекции и Generics"
              required
              autoFocus
              className="w-full text-xs sm:text-sm bg-[var(--bg-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent)] rounded-2xl px-4 py-2.5 text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-2 flex items-center justify-between">
              <span>Подзадачи (каждая с новой строки)</span>
              <span className="text-[10px] text-[var(--text-subtle)] font-normal lowercase tracking-normal">Необязательно</span>
            </label>
            <textarea
              value={tasksText}
              onChange={(e) => setTasksText(e.target.value)}
              rows={4}
              placeholder={`Интерфейс List и ArrayList\nМножества Set и HashSet\nАссоциативные массивы Map (HashMap)`}
              className="w-full text-xs sm:text-sm bg-[var(--bg-subtle)] border border-[var(--border-subtle)] focus:border-[var(--accent)] rounded-2xl p-3 text-[var(--text-main)] placeholder:text-[var(--text-subtle)] focus:outline-none transition-colors font-sans resize-none"
            />
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
              <span>Создать тему</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
