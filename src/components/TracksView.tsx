import React, { useState } from 'react';
import { LearningTrack } from '../types';
import { Plus, GitBranch, ArrowRight, Trash2, Edit2, CheckCircle2, BookOpen } from 'lucide-react';

interface TracksViewProps {
  tracks: LearningTrack[];
  onSelectTrack: (trackId: string) => void;
  onOpenAddTrackModal: () => void;
  onDeleteTrack: (trackId: string) => void;
  onEditTrack: (trackId: string, newTitle: string, newDescription: string) => void;
}

export const TracksView: React.FC<TracksViewProps> = ({
  tracks,
  onSelectTrack,
  onOpenAddTrackModal,
  onDeleteTrack,
  onEditTrack,
}) => {
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const startEdit = (track: LearningTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTrackId(track.id);
    setEditTitle(track.title);
    setEditDesc(track.description);
  };

  const saveEdit = (trackId: string) => {
    if (editTitle.trim()) {
      onEditTrack(trackId, editTitle.trim(), editDesc.trim());
    }
    setEditingTrackId(null);
  };

  // Calculate overall stats across tracks
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
  const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-1.5">
            <GitBranch className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Каталог траекторий</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--text-main)]">
            Ветки обучения
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
            Создавайте независимые ветки для любых языков и технологий (Java, Spring, Python и др.), добавляйте темы и ведите практический трекинг.
          </p>
        </div>

        <button
          onClick={onOpenAddTrackModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-text)] text-xs font-bold uppercase tracking-widest transition-all self-start md:self-auto shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Новая ветка</span>
        </button>
      </div>

      {/* Global Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-4 rounded-2xl transition-colors">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono">
            Веток обучения
          </div>
          <div className="text-xl sm:text-2xl font-light text-[var(--text-main)] mt-1">
            {tracks.length}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-4 rounded-2xl transition-colors">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono">
            Всего тем
          </div>
          <div className="text-xl sm:text-2xl font-light text-[var(--text-main)] mt-1">
            {totalTopics}
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-4 rounded-2xl transition-colors">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono">
            Задач выполнено
          </div>
          <div className="text-xl sm:text-2xl font-light text-[var(--text-main)] mt-1">
            {completedTasks} <span className="text-xs text-[var(--text-subtle)]">/ {totalTasks}</span>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-card)] p-4 rounded-2xl transition-colors">
          <div className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono">
            Общий прогресс
          </div>
          <div className="text-xl sm:text-2xl font-light text-[var(--text-main)] mt-1 font-mono">
            {overallPercentage}%
          </div>
        </div>
      </div>

      {/* Learning Tracks Section */}
      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 sm:p-16 rounded-3xl border-2 border-dashed border-[var(--border-card)] bg-[var(--bg-card)]/30 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)] mb-4 shadow-sm">
            <GitBranch className="w-7 h-7" />
          </div>
          <h2 className="text-lg sm:text-xl font-medium tracking-tight text-[var(--text-main)] mb-2">
            Здесь пока нет веток обучения
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mb-6 leading-relaxed">
            Создайте свою первую траекторию (например, Python, React, Java, Алгоритмы или иностранный язык) и начните отмечать прогресс по темам.
          </p>
          <button
            onClick={onOpenAddTrackModal}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-text)] text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Создать первую ветку</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {tracks.map((track) => {
            const trackTotalTasks = track.topics.reduce(
              (acc, top) => acc + top.tasks.length,
              0
            );
            const trackCompletedTasks = track.topics.reduce(
              (acc, top) => acc + top.tasks.filter((t) => t.completed).length,
              0
            );
            const percent =
              trackTotalTasks > 0
                ? Math.round((trackCompletedTasks / trackTotalTasks) * 100)
                : 0;
            const isComplete = trackTotalTasks > 0 && trackCompletedTasks === trackTotalTasks;

            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track.id)}
                className="group flex flex-col justify-between bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent)] p-6 rounded-3xl cursor-pointer transition-all duration-200 relative hover:shadow-xl"
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] font-mono border border-[var(--border-subtle)]">
                      {track.category}
                    </span>

                    {isComplete ? (
                      <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--accent-text)] font-bold bg-[var(--accent)] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Освоено
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {percent}%
                      </span>
                    )}
                  </div>

                  {editingTrackId === track.id ? (
                    <div
                      className="space-y-2 mb-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full text-sm bg-[var(--bg-subtle)] border-b border-[var(--accent)] px-2 py-1 text-[var(--text-main)] outline-none rounded"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Описание..."
                        className="w-full text-xs bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)] px-2 py-1 text-[var(--text-muted)] outline-none rounded"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => saveEdit(track.id)}
                          className="text-[11px] font-bold uppercase px-3 py-1 bg-[var(--accent)] text-[var(--accent-text)] rounded"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={() => setEditingTrackId(null)}
                          className="text-[11px] text-[var(--text-muted)] px-2 py-1"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-base sm:text-lg font-medium tracking-tight text-[var(--text-main)] mb-1.5 truncate">
                        {track.title}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">
                        {track.description}
                      </p>
                    </>
                  )}

                  {/* Progress Mini Bar */}
                  <div className="space-y-1.5 my-4 pt-2 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-[var(--accent)]" />
                        {track.topics.length} тем
                      </span>
                      <span className="font-mono">
                        {trackCompletedTasks}/{trackTotalTasks} задач
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-subtle)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent)] transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Footer: Action & Management */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => startEdit(track, e)}
                      className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded transition-colors"
                      title="Редактировать название и описание"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Удалить ветку «${track.title}»?`)) {
                          onDeleteTrack(track.id);
                        }
                      }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 rounded transition-colors"
                      title="Удалить ветку"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-main)] group-hover:translate-x-1 transition-transform">
                    <span>Открыть</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Create New Track Card */}
          <button
            onClick={onOpenAddTrackModal}
            className="flex flex-col items-center justify-center p-8 rounded-3xl border border-dashed border-[var(--border-card)] hover:border-[var(--accent)] bg-[var(--bg-card)]/40 hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all group min-h-[220px]"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-text)] transition-all mb-3">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--text-main)] transition-colors">
              Создать ветку обучения
            </span>
            <span className="text-[11px] text-[var(--text-muted)] mt-1 text-center max-w-[200px]">
              Например: JavaScript, Spring, SQL, Алгоритмы
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
