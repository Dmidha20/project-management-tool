import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import { STATUS_META, TASK_STATUS_ORDER } from "@app/data/types";
import { SummaryCard } from "@app/components/ui/cards";
import { Avatar, Badge, BarChart, DonutChart, Panel } from "@app/components/ui";
import { useAppSelector } from "@app/store";
import { isDone, isOpen, statusCounts } from "@app/data/derive";
import { cn, daysUntil, formatShortDate } from "@app/lib";

const Overview = () => {
  const navigate = useNavigate();
  const projects = useAppSelector((state) => state.projects);
  const tasks = useAppSelector((state) => state.tasks);
  const members = useAppSelector((state) => state.members);

  const openTasks = tasks.filter((task) => isOpen(task.status));
  const completedTasks = tasks.filter((task) => isDone(task.status));
  const completionRate = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const counts = statusCounts(tasks);
  const donutData = TASK_STATUS_ORDER.filter((status) => counts[status] > 0).map((status) => ({
    label: STATUS_META[status].label,
    value: counts[status],
    color: STATUS_META[status].accent,
  }));

  const projectProgress = projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.projectId === project.id);
    const done = projectTasks.filter((task) => isDone(task.status)).length;
    return {
      name: project.name,
      color: project.color,
      percent: projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0,
    };
  });

  const attention = tasks
    .filter((task) => {
      if (!isOpen(task.status)) return false;
      const due = daysUntil(task.dueDate);
      return task.critical || (due !== null && due < 2);
    })
    .sort((a, b) => (daysUntil(a.dueDate) ?? 99) - (daysUntil(b.dueDate) ?? 99))
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Welcome back, Alice 👋
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Here's what's happening across your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Projects"
          value={projects.length}
          icon={<Icon icon="solar:folder-with-files-bold-duotone" width={28} />}
        />
        <SummaryCard
          title="Open Tasks"
          value={openTasks.length}
          icon={<Icon icon="solar:checklist-bold-duotone" width={28} />}
        />
        <SummaryCard
          title="Completed"
          value={completedTasks.length}
          change={`${completionRate}%`}
          trend="up"
          icon={<Icon icon="solar:verified-check-bold-duotone" width={28} />}
        />
        <SummaryCard
          title="Team Members"
          value={members.length}
          icon={<Icon icon="solar:users-group-rounded-bold-duotone" width={28} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Panel
          className="xl:col-span-7"
          title="Project Progress"
          subtitle="Completion across all projects"
        >
          <BarChart
            categories={projectProgress.map((item) => item.name)}
            data={projectProgress.map((item) => item.percent)}
            colors={projectProgress.map((item) => item.color)}
            max={100}
            valueSuffix="%"
            seriesName="Progress"
            height={260}
          />
        </Panel>

        <Panel
          className="xl:col-span-5"
          title="Tasks by Status"
          subtitle="Current distribution"
        >
          <div className="flex flex-col items-center gap-4">
            <DonutChart data={donutData} centerLabel="Total Tasks" />
            <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
              {TASK_STATUS_ORDER.map((status) => (
                <div key={status} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_META[status].accent }}
                  />
                  <span className="flex-1 text-[var(--color-text-secondary)]">
                    {STATUS_META[status].label}
                  </span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {counts[status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Needs attention"
        subtitle="Critical or due soon"
        action={
          <button
            type="button"
            onClick={() => navigate("/dashboard/board?critical=1")}
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            View board
          </button>
        }
      >
        <div className="divide-y divide-[var(--color-divider)]">
          {attention.map((task) => {
            const project = projects.find((item) => item.id === task.projectId);
            const assignee = members.find((item) => item.id === task.assigneeId);
            const due = daysUntil(task.dueDate);
            const overdue = due !== null && due < 0;

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => navigate(`/dashboard/board?task=${task.id}`)}
                className="flex w-full items-center gap-3 py-3 text-left transition hover:bg-[var(--color-neutral-100)]"
              >
                {task.critical && (
                  <Icon icon="solar:danger-triangle-bold" width={18} className="text-[var(--color-error-500)]" />
                )}
                <span className="w-16 shrink-0 text-xs font-medium text-[var(--color-text-secondary)]">
                  {task.code}
                </span>
                <span className="flex-1 truncate text-sm font-medium text-[var(--color-text-primary)]">
                  {task.title}
                </span>
                <span className="hidden items-center gap-1.5 text-xs text-[var(--color-text-secondary)] sm:flex">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project?.color }} />
                  {project?.name}
                </span>
                <Badge className={STATUS_META[task.status].badge} dot={STATUS_META[task.status].accent}>
                  {STATUS_META[task.status].label}
                </Badge>
                <span
                  className={cn(
                    "hidden w-20 text-right text-xs sm:block",
                    overdue ? "font-medium text-[var(--color-error-600)]" : "text-[var(--color-text-secondary)]",
                  )}
                >
                  {formatShortDate(task.dueDate) || "—"}
                </span>
                {assignee ? (
                  <Avatar name={assignee.name} size="xs" />
                ) : (
                  <span className="h-6 w-6" />
                )}
              </button>
            );
          })}

          {attention.length === 0 && (
            <p className="py-6 text-center text-sm text-[var(--color-text-secondary)]">
              Nothing urgent — you're all caught up. 🎉
            </p>
          )}
        </div>
      </Panel>
    </div>
  );
};

export { Overview };
export default Overview;
