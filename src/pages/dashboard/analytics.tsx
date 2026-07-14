import { Icon } from "@iconify/react";

import type { TaskType } from "@app/data/types";
import { TASK_TYPE_ORDER, TYPE_META } from "@app/data/types";
import { BarChart, DonutChart, Panel } from "@app/components/ui";
import { useAppSelector } from "@app/store";
import { estimateDays, isOpen, typeCounts } from "@app/data/derive";

const TYPE_COLOR: Record<TaskType, string> = {
  modeling: "var(--color-info-500)",
  drawing: "var(--color-warning-500)",
  closeout: "var(--color-success-500)",
};

const Analytics = () => {
  const projects = useAppSelector((state) => state.projects);
  const tasks = useAppSelector((state) => state.tasks);
  const members = useAppSelector((state) => state.members);

  const types = typeCounts(tasks);
  const typeData = TASK_TYPE_ORDER.map((type) => ({
    label: TYPE_META[type].label,
    value: types[type],
    color: TYPE_COLOR[type],
  }));

  const perProject = projects.map((project) => ({
    name: project.name,
    color: project.color,
    count: tasks.filter((task) => task.projectId === project.id).length,
  }));

  const workload = members
    .map((member) => ({
      name: member.name.split(" ")[0],
      count: tasks.filter((task) => task.assigneeId === member.id && isOpen(task.status)).length,
    }))
    .sort((a, b) => b.count - a.count);

  const estimates = projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.projectId === project.id);
    const openCount = projectTasks.filter((task) => isOpen(task.status)).length;
    return {
      project,
      openCount,
      days: estimateDays(projectTasks, project.memberIds.length),
    };
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Analytics</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Workload distribution and delivery forecasts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-5" title="Tasks by Type">
          <div className="flex flex-col items-center gap-4">
            <DonutChart data={typeData} centerLabel="Total" />
            <div className="flex w-full flex-col gap-2">
              {TASK_TYPE_ORDER.map((type) => (
                <div key={type} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: TYPE_COLOR[type] }} />
                  <span className="flex-1 text-[var(--color-text-secondary)]">{TYPE_META[type].label}</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">{types[type]}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="xl:col-span-7" title="Tasks per Project">
          <BarChart
            categories={perProject.map((item) => item.name)}
            data={perProject.map((item) => item.count)}
            colors={perProject.map((item) => item.color)}
            seriesName="Tasks"
            valueSuffix=" tasks"
            height={280}
          />
        </Panel>

        <Panel className="xl:col-span-7" title="Member Workload" subtitle="Open tasks per member">
          <BarChart
            categories={workload.map((item) => item.name)}
            data={workload.map((item) => item.count)}
            horizontal
            color="var(--color-primary)"
            seriesName="Open tasks"
            height={280}
          />
        </Panel>

        <Panel
          className="xl:col-span-5"
          title="Estimated delivery"
          subtitle="AI forecast from open tasks"
          action={
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-100)] text-[var(--color-primary)]">
              <Icon icon="solar:magic-stick-3-bold-duotone" width={18} />
            </span>
          }
        >
          <div className="space-y-3">
            {estimates.map(({ project, openCount, days }) => (
              <div
                key={project.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-3"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                  style={{ backgroundColor: project.color }}
                >
                  {project.code}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                    {project.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {openCount} open · {project.memberIds.length} members
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[var(--color-primary)]">~{days}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">days</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};

export { Analytics };
export default Analytics;
