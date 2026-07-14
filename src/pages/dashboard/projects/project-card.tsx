import { Icon } from "@iconify/react";

import type { Member, Project, Task } from "@app/data/types";
import { PROJECT_STATUS_META } from "@app/data/types";
import { AvatarGroup, Badge, Progress } from "@app/components/ui";
import { formatDate } from "@app/lib";
import { progressOf } from "@app/data/derive";

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  members: Member[];
  onOpen: () => void;
  onManageMembers: () => void;
}

const Stat = ({ icon, label, value }: { icon: string; label: string; value: number }) => (
  <div className="flex items-center gap-1.5 text-sm">
    <Icon icon={icon} width={16} className="text-[var(--color-text-secondary)]" />
    <span className="font-semibold text-[var(--color-text-primary)]">{value}</span>
    <span className="text-[var(--color-text-secondary)]">{label}</span>
  </div>
);

export const ProjectCard = ({
  project,
  tasks,
  members,
  onOpen,
  onManageMembers,
}: ProjectCardProps) => {
  const projectTasks = tasks.filter((task) => task.projectId === project.id);
  const progress = progressOf(projectTasks);
  const criticalOpen = projectTasks.filter(
    (task) => task.critical && task.status !== "completed",
  ).length;
  const memberNames = members
    .filter((member) => project.memberIds.includes(member.id))
    .map((member) => member.name);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className="h-1.5" style={{ backgroundColor: project.color }} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <button type="button" onClick={onOpen} className="flex items-start gap-3 text-left">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: project.color }}
            >
              {project.code}
            </span>
            <div>
              <h3 className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                {project.name}
              </h3>
              <Badge className={PROJECT_STATUS_META[project.status]}>{project.status}</Badge>
            </div>
          </button>

          <button
            type="button"
            onClick={onManageMembers}
            title="Assign members"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition hover:bg-[var(--color-neutral-150)] hover:text-[var(--color-text-primary)]"
          >
            <Icon icon="solar:users-group-rounded-linear" width={18} />
          </button>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-[var(--color-text-secondary)]">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Stat icon="solar:checklist-minimalistic-linear" label="tasks" value={projectTasks.length} />
          <Stat icon="solar:layers-minimalistic-linear" label="sections" value={project.sections.length} />
          {criticalOpen > 0 && (
            <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-error-600)]">
              <Icon icon="solar:danger-triangle-bold" width={16} />
              <span className="font-semibold">{criticalOpen}</span> critical
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-secondary)]">Progress</span>
            <span className="font-semibold text-[var(--color-text-primary)]">{progress.percent}%</span>
          </div>
          <Progress value={progress.percent} color={project.color} />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--color-divider)] pt-4">
          {memberNames.length > 0 ? (
            <AvatarGroup names={memberNames} />
          ) : (
            <span className="text-xs text-[var(--color-text-secondary)]">No members yet</span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <Icon icon="solar:calendar-linear" width={14} />
            {formatDate(project.dueDate)}
          </span>
        </div>
      </div>
    </div>
  );
};
