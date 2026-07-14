import { Icon } from "@iconify/react";

import type { Section, Task } from "@app/data/types";
import { STATUS_META, TASK_STATUS_ORDER } from "@app/data/types";
import { Badge, Progress } from "@app/components/ui";
import { progressOf } from "@app/data/derive";

interface SectionCardProps {
  section: Section;
  tasks: Task[];
  color: string;
  onOpen: () => void;
  onEdit: () => void;
}

export const SectionCard = ({ section, tasks, color, onOpen, onEdit }: SectionCardProps) => {
  const sectionTasks = tasks.filter((task) => task.sectionId === section.id);
  const progress = progressOf(sectionTasks);
  const criticalOpen = sectionTasks.filter(
    (task) => task.critical && task.status !== "completed",
  ).length;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className="h-1.5" style={{ backgroundColor: color }} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <button type="button" onClick={onOpen} className="flex items-start gap-3 text-left">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: color }}
            >
              <Icon icon="solar:layers-minimalistic-bold" width={20} />
            </span>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                {section.name}
              </h3>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {sectionTasks.length} tasks
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={onEdit}
            title="Rename or remove section"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition hover:bg-[var(--color-neutral-150)] hover:text-[var(--color-text-primary)]"
          >
            <Icon icon="solar:pen-linear" width={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {TASK_STATUS_ORDER.filter((status) =>
            sectionTasks.some((task) => task.status === status),
          ).map((status) => (
            <Badge key={status} className={STATUS_META[status].badge} dot={STATUS_META[status].accent}>
              {sectionTasks.filter((task) => task.status === status).length} {STATUS_META[status].label}
            </Badge>
          ))}
          {sectionTasks.length === 0 && (
            <span className="text-xs text-[var(--color-text-secondary)]">No tasks yet</span>
          )}
          {criticalOpen > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-error-600)]">
              <Icon icon="solar:danger-triangle-bold" width={14} />
              {criticalOpen} critical
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-secondary)]">Progress</span>
            <span className="font-semibold text-[var(--color-text-primary)]">{progress.percent}%</span>
          </div>
          <Progress value={progress.percent} color={color} />
        </div>
      </div>
    </div>
  );
};
