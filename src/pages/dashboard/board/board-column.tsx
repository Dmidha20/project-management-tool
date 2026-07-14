import { useRef } from "react";
import { Icon } from "@iconify/react";

import type { Member, Project, Task, TaskStatus } from "@app/data/types";
import { STATUS_META } from "@app/data/types";
import { TaskCard } from "./task-card";

const getDropIndex = (container: HTMLElement, clientY: number): number => {
  const cards = Array.from(
    container.querySelectorAll<HTMLElement>('[data-card]:not([data-dragging="true"])'),
  );
  for (let i = 0; i < cards.length; i += 1) {
    const rect = cards[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) return i;
  }
  return cards.length;
};

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  membersById: Record<string, Member>;
  projectsById: Record<string, Project>;
  showProjectTag: boolean;
  draggingId: string | null;
  dragOverIndex: number | null;
  onColumnDragOver: (status: TaskStatus, index: number) => void;
  onColumnDrop: (status: TaskStatus, index: number) => void;
  onColumnDragLeave: (status: TaskStatus) => void;
  onOpenTask: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
  onCardDragStart: (taskId: string) => void;
  onCardDragEnd: () => void;
}

export const BoardColumn = ({
  status,
  tasks,
  membersById,
  projectsById,
  showProjectTag,
  draggingId,
  dragOverIndex,
  onColumnDragOver,
  onColumnDrop,
  onColumnDragLeave,
  onOpenTask,
  onAddTask,
  onCardDragStart,
  onCardDragEnd,
}: BoardColumnProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const meta = STATUS_META[status];

  const handleDragOver = (event: React.DragEvent) => {
    if (!draggingId || !bodyRef.current) return;
    event.preventDefault();
    onColumnDragOver(status, getDropIndex(bodyRef.current, event.clientY));
  };

  const handleDrop = (event: React.DragEvent) => {
    if (!bodyRef.current) return;
    event.preventDefault();
    onColumnDrop(status, getDropIndex(bodyRef.current, event.clientY));
  };

  const Indicator = () => (
    <div className="h-1 rounded-full bg-[var(--color-primary-400)]" />
  );

  return (
    <section className="flex h-full w-[300px] shrink-0 flex-col">
      <header className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.accent }} />
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{meta.label}</h3>
          <span className="rounded-full bg-[var(--color-neutral-150)] px-2 py-0.5 text-xs font-semibold text-[var(--color-neutral-600)]">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAddTask(status)}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition hover:bg-[var(--color-neutral-150)] hover:text-[var(--color-text-primary)]"
          title="Add task"
        >
          <Icon icon="solar:add-circle-linear" width={18} />
        </button>
      </header>

      <div
        ref={bodyRef}
        onDragOver={handleDragOver}
        onDragLeave={() => onColumnDragLeave(status)}
        onDrop={handleDrop}
        className={`flex flex-1 flex-col gap-2.5 overflow-y-auto rounded-2xl border p-2.5 transition-colors [scrollbar-width:thin] ${
          dragOverIndex !== null
            ? "border-[var(--color-primary-300)] " + meta.soft
            : "border-transparent bg-[var(--color-neutral-100)]/60"
        }`}
      >
        {tasks.map((task, index) => (
          <div key={task.id} className="flex flex-col gap-2.5">
            {dragOverIndex === index && <Indicator />}
            <TaskCard
              task={task}
              assignee={task.assigneeId ? membersById[task.assigneeId] : undefined}
              project={projectsById[task.projectId]}
              showProjectTag={showProjectTag}
              isDragging={draggingId === task.id}
              onOpen={() => onOpenTask(task.id)}
              onDragStart={() => onCardDragStart(task.id)}
              onDragEnd={onCardDragEnd}
            />
          </div>
        ))}

        {dragOverIndex === tasks.length && <Indicator />}

        {tasks.length === 0 && dragOverIndex === null && (
          <button
            type="button"
            onClick={() => onAddTask(status)}
            className="flex h-20 items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary)]"
          >
            + Add task
          </button>
        )}
      </div>
    </section>
  );
};
