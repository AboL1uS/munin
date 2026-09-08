import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { TaskItem } from '../types';
import { FormattedText } from '../utils/textFormatter';

interface TaskRowProps {
  task: TaskItem;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newTitle: string) => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onEdit(task.id, trimmed);
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      id={`task-item-${task.id}`}
      className={`group relative flex items-center justify-between gap-3 px-2.5 py-2 rounded-xl transition-all ${
        task.completed ? 'opacity-50 hover:opacity-80' : 'hover:bg-[var(--bg-subtle)]'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Minimalist Monochromatic Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all focus:outline-none cursor-pointer ${
            task.completed
              ? 'border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-text)] shadow-xs'
              : 'border border-[var(--text-subtle)] hover:border-[var(--accent)] bg-transparent text-transparent'
          }`}
          aria-label={task.completed ? "Отметить невыполненной" : "Отметить выполненной"}
        >
          {task.completed && (
            <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[3]" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Task Text or Edit Input */}
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyDown}
              className="w-full text-xs sm:text-sm bg-transparent border-b border-[var(--accent)] px-1 py-0.5 text-[var(--text-main)] focus:outline-none font-sans"
            />
          ) : (
            <div
              onClick={() => onToggle(task.id)}
              className="cursor-pointer select-none"
            >
              <FormattedText text={task.title} completed={task.completed} />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded transition-colors"
          title="Редактировать задачу"
        >
          <Edit2 className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="p-1 text-[var(--text-muted)] hover:text-rose-400 rounded transition-colors"
          title="Удалить задачу"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
