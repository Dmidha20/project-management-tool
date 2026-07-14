import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import type { Task } from "@app/data/types";
import { STATUS_META, TASK_STATUS_ORDER } from "@app/data/types";
import { Avatar, Badge, Select } from "@app/components/ui";
import { useAppSelector } from "@app/store";
import { cn, formatShortDate } from "@app/lib";

type GroupBy = "member" | "status" | "project" | "critical";

interface Group {
  key: string;
  label: string;
  color?: string;
  tasks: Task[];
}

const Reports = () => {
  const navigate = useNavigate();
  const tasks = useAppSelector((state) => state.tasks);
  const members = useAppSelector((state) => state.members);
  const projects = useAppSelector((state) => state.projects);

  const [groupBy, setGroupBy] = useState<GroupBy>("member");

  const memberName = (id?: string) => members.find((m) => m.id === id)?.name;
  const projectOf = (id: string) => projects.find((p) => p.id === id);

  const groups = useMemo<Group[]>(() => {
    if (groupBy === "status") {
      return TASK_STATUS_ORDER.map((status) => ({
        key: status,
        label: STATUS_META[status].label,
        color: STATUS_META[status].accent,
        tasks: tasks.filter((task) => task.status === status),
      })).filter((group) => group.tasks.length > 0);
    }

    if (groupBy === "project") {
      return projects.map((project) => ({
        key: project.id,
        label: project.name,
        color: project.color,
        tasks: tasks.filter((task) => task.projectId === project.id),
      })).filter((group) => group.tasks.length > 0);
    }

    if (groupBy === "critical") {
      return [
        { key: "critical", label: "Critical", color: "var(--color-error-500)", tasks: tasks.filter((t) => t.critical) },
        { key: "normal", label: "Standard", color: "var(--color-neutral-400)", tasks: tasks.filter((t) => !t.critical) },
      ].filter((group) => group.tasks.length > 0);
    }

    // member
    const groupsByMember: Group[] = members.map((member) => ({
      key: member.id,
      label: member.name,
      tasks: tasks.filter((task) => task.assigneeId === member.id),
    }));
    const unassigned = tasks.filter((task) => !task.assigneeId);
    if (unassigned.length) {
      groupsByMember.push({ key: "unassigned", label: "Unassigned", tasks: unassigned });
    }
    return groupsByMember.filter((group) => group.tasks.length > 0);
  }, [groupBy, tasks, members, projects]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Reports</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Group and review tasks across the workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-text-secondary)]">Group by</span>
          <Select
            className="w-44"
            value={groupBy}
            onChange={(value) => setGroupBy(value as GroupBy)}
            options={[
              { value: "member", label: "Member" },
              { value: "status", label: "Status" },
              { value: "project", label: "Project" },
              { value: "critical", label: "Critical" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-5">
        {groups.map((group) => {
          const done = group.tasks.filter((task) => task.status === "completed").length;

          return (
            <div
              key={group.key}
              className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-xs)]"
            >
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-3.5">
                {groupBy === "member" ? (
                  <Avatar name={group.label} size="sm" />
                ) : (
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: group.color }} />
                )}
                <h3 className="font-semibold text-[var(--color-text-primary)]">{group.label}</h3>
                <span className="rounded-full bg-[var(--color-neutral-150)] px-2 py-0.5 text-xs font-semibold text-[var(--color-neutral-600)]">
                  {group.tasks.length}
                </span>
                <span className="ml-auto text-xs text-[var(--color-text-secondary)]">
                  {done}/{group.tasks.length} completed
                </span>
              </div>

              <table className="w-full text-sm">
                <tbody>
                  {group.tasks.map((task) => {
                    const project = projectOf(task.projectId);
                    return (
                      <tr
                        key={task.id}
                        onClick={() => navigate(`/dashboard/board?task=${task.id}`)}
                        className="cursor-pointer border-b border-[var(--color-divider)] last:border-0 transition hover:bg-[var(--color-neutral-100)]"
                      >
                        <td className="w-20 px-5 py-3 text-xs font-medium text-[var(--color-text-secondary)]">
                          <span className="inline-flex items-center gap-1.5">
                            {task.critical && (
                              <Icon icon="solar:danger-triangle-bold" width={14} className="text-[var(--color-error-500)]" />
                            )}
                            {task.code}
                          </span>
                        </td>
                        <td className="px-2 py-3 font-medium text-[var(--color-text-primary)]">
                          {task.title}
                        </td>
                        <td className="hidden px-2 py-3 md:table-cell">
                          <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project?.color }} />
                            {project?.name}
                          </span>
                        </td>
                        <td className="hidden px-2 py-3 lg:table-cell">
                          {groupBy !== "member" && task.assigneeId ? (
                            <span className="inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                              <Avatar name={memberName(task.assigneeId) ?? "?"} size="xs" />
                              {memberName(task.assigneeId)}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-2 py-3">
                          <Badge
                            className={STATUS_META[task.status].badge}
                            dot={STATUS_META[task.status].accent}
                          >
                            {STATUS_META[task.status].label}
                          </Badge>
                        </td>
                        <td
                          className={cn(
                            "px-5 py-3 text-right text-xs",
                            "text-[var(--color-text-secondary)]",
                          )}
                        >
                          {formatShortDate(task.dueDate) || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { Reports };
export default Reports;
