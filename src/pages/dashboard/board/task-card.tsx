import { Icon } from "@iconify/react";

import type { Member, Project, Task } from "@app/data/types";
import { TYPE_META } from "@app/data/types";
import { Avatar, Badge } from "@app/components/ui";
import { cn, daysUntil, formatShortDate } from "@app/lib";
import { isDone } from "@app/data/derive";

interface TaskCardProps {
  task: Task;
  assignee?: Member;
  project?: Project;
  showProjectTag?: boolean;
  isDragging?: boolean;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const MetaIcon = ({ icon, value }: { icon: string; value: number }) =>
  value > 0 ? (
    <span className="inline-flex items-center gap-1 text-[var(--color-text-secondary)]">
      <Icon icon={icon} width={14} />
      {value}
    </span>
  ) : null;

export const TaskCard = ({
  task,
  assignee,
  project,
  showProjectTag,
  isDragging,
  onOpen,
  onDragStart,
  onDragEnd,
}: TaskCardProps) => {
  const type = TYPE_META[task.type];
  const due = daysUntil(task.dueDate);
  const overdue = due !== null && due < 0 && !isDone(task.status);
  const checklistDone = task.checklist.filter((c) => c.done).length;

  return (
    <article
      data-card
      data-dragging={isDragging ? "true" : undefined}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className={cn(
        "group cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 shadow-[var(--shadow-xs)] transition-all hover:border-[var(--color-primary-300)] hover:shadow-[var(--shadow-md)]",
        isDragging && "opacity-40",
        task.critical && "border-l-[3px] border-l-[var(--color-error-500)]",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <Badge className={type.badge} icon={type.icon}>
          {type.label}
        </Badge>

        {task.critical && (
          <Badge
            className="bg-[var(--color-error-100)] text-[var(--color-error-600)]"
            icon="solar:danger-triangle-bold"
          >
            Critical
          </Badge>
        )}
      </div>

      <h4 className="text-sm font-semibold leading-snug text-[var(--color-text-primary)]">
        {task.title}
      </h4>

      <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
        <span className="font-medium">{task.code}</span>
        {showProjectTag && project && (
          <>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
              {project.name}
            </span>
          </>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[var(--color-divider)] pt-2.5">
        <div className="flex items-center gap-3 text-xs">
          {task.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1",
                overdue
                  ? "font-medium text-[var(--color-error-600)]"
                  : "text-[var(--color-text-secondary)]",
              )}
            >
              <Icon icon="solar:calendar-linear" width={14} />
              {formatShortDate(task.dueDate)}
            </span>
          )}
          <MetaIcon icon="solar:chat-round-line-linear" value={task.comments.length} />
          <MetaIcon icon="solar:paperclip-linear" value={task.links.length + task.attachments.length} />
          {task.checklist.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[var(--color-text-secondary)]">
              <Icon icon="solar:checklist-minimalistic-linear" width={14} />
              {checklistDone}/{task.checklist.length}
            </span>
          )}
        </div>

        {assignee ? (
          <Avatar name={assignee.name} size="xs" />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-[var(--color-border)] text-[var(--color-text-disabled)]">
            <Icon icon="solar:user-linear" width={13} />
          </span>
        )}
      </div>
    </article>
  );
};
