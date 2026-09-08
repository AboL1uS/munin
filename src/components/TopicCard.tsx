import React, { useState, useRef } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Minus,
} from 'lucide-react';
import { TopicGroup } from '../types';
import { TaskRow } from './TaskRow';

interface TopicCardProps {
  topic: TopicGroup;
  onToggleTask: (topicId: string, taskId: string) => void;
  onDeleteTask: (topicId: string, taskId: string) => void;
  onEditTask: (topicId: string, taskId: string, newTitle: string) => void;
  onAddTask: (topicId: string, title: string) => void;
  onToggleTopicAllTasks: (topicId: string) => void;
  onDeleteTopic: (topicId: string) => void;
  onEditTopicTitle: (topicId: string, newTitle: string) => void;
  onToggleCollapse: (topicId: string) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onAddTask,
  onToggleTopicAllTasks,
  onDeleteTopic,
  onEditTopicTitle,
  onToggleCollapse,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);
  const newTaskInputRef = useRef<HTMLInputElement>(null);

  const totalTasks = topic.tasks.length;
  const completedTasks = topic.tasks.filter((t) => t.completed).length;
  const isAllComplete = totalTasks > 0 && completedTasks === totalTasks;
  const isPartiallyComplete = completedTasks > 0 && completedTasks < totalTasks;
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleSaveTitle = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== topic.title) {
      onEditTopicTitle(topic.id, trimmed);
    } else {
      setEditTitle(topic.title);
    }
    setIsEditingTitle(false);
  };

  const handleAddNewTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (trimmed) {
      onAddTask(topic.id, trimmed);
      setNewTaskTitle('');
    }
  };

  const startAdding = () => {
    setIsAddingTask(true);
    setTimeout(() => {
      newTaskInputRef.current?.focus();
    }, 50);
  };

  return (
    <div
      id={`topic-card-${topic.id}`}
      className="flex flex-col bg-[var(--bg-card)] border border-[var(--border-card)] p-5 sm:p-6 rounded-3xl transition-all shadow-xs"
    >
      {/* Topic Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          {/* Topic Master Checkbox */}
          <button
            type="button"
            onClick={() => onToggleTopicAllTasks(topic.id)}
            className={`shrink-0 mt-0.5 sm:mt-0 w-5 h-5 rounded-md flex items-center justify-center transition-all focus:outline-none cursor-pointer ${
              isAllComplete
                ? 'border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)]'
                : isPartiallyComplete
                ? 'border border-[var(--accent)] bg-[var(--bg-subtle)] text-[var(--accent)]'
                : 'border border-[var(--text-subtle)] hover:border-[var(--accent)] bg-transparent text-transparent'
            }`}
            title={
              isAllComplete
                ? 'Снять отметки со всех задач этой темы'
                : 'Отметить все задачи темы как выполненные'
            }
          >
            {isAllComplete && (
              <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {isPartiallyComplete && <Minus className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Title or Edit Input */}
          <div className="min-w-0 flex-1">
            {isEditingTitle ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                autoFocus
                className="w-full text-xs sm:text-sm font-medium bg-transparent border-b border-[var(--accent)] px-1 py-0.5 text-[var(--text-main)] focus:outline-none"
              />
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  onClick={() => onToggleCollapse(topic.id)}
                  className={`text-xs uppercase tracking-widest font-semibold cursor-pointer select-none transition-colors ${
                    isAllComplete ? 'text-[var(--text-main)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {topic.title}
                </h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isAllComplete
                      ? 'bg-[var(--accent)] text-[var(--accent-text)] font-bold'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {completedTasks}/{totalTasks}
                </span>
              </div>
            )}

            {/* Micro progress bar */}
            <div className="w-24 h-1 bg-[var(--bg-subtle)] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            type="button"
            onClick={startAdding}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors"
            title="Добавить задачу в эту тему"
          >
            <Plus className="w-3 h-3" />
            <span>Пункт</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditingTitle(true)}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg transition-colors"
            title="Переименовать тему"
          >
            <Edit2 className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteTopic(topic.id)}
            className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 rounded-lg transition-colors"
            title="Удалить тему"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => onToggleCollapse(topic.id)}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg transition-colors"
            title={topic.isCollapsed ? 'Развернуть' : 'Свернуть'}
          >
            {topic.isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Topic Tasks Body */}
      {!topic.isCollapsed && (
        <div className="space-y-1 flex-1 pt-1">
          {topic.tasks.length === 0 ? (
            <div className="text-center py-6 text-[var(--text-muted)] text-xs">
              В этой теме пока нет задач.
            </div>
          ) : (
            topic.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={(taskId) => onToggleTask(topic.id, taskId)}
                onDelete={(taskId) => onDeleteTask(topic.id, taskId)}
                onEdit={(taskId, newTitle) => onEditTask(topic.id, taskId, newTitle)}
              />
            ))
          )}

          {/* Inline Add Task Form */}
          {isAddingTask ? (
            <form onSubmit={handleAddNewTask} className="mt-3 pt-2">
              <div className="flex items-center gap-2 bg-[var(--bg-subtle)] p-1.5 pl-3 rounded-full border border-[var(--border-subtle)]">
                <input
                  ref={newTaskInputRef}
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Новая подзадача или пункт темы..."
                  className="flex-1 text-xs bg-transparent text-[var(--text-main)] placeholder:text-[var(--text-subtle)] outline-none"
                />
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 disabled:opacity-30 transition-colors"
                >
                  Ок
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskTitle('');
                  }}
                  className="px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                onClick={startAdding}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] uppercase tracking-wider font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-xl border border-dashed border-[var(--border-subtle)] hover:border-[var(--border-card)] hover:bg-[var(--bg-subtle)] transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>Добавить пункт</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
