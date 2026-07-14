import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";

import type { Member, Project, TaskStatus } from "@app/data/types";
import { TASK_STATUS_ORDER, TASK_TYPE_ORDER, TYPE_META } from "@app/data/types";
import { Button, EmptyState, Select } from "@app/components/ui";
import { useAppDispatch, useAppSelector } from "@app/store";
import { moveTask } from "@app/store/slices/tasks-slice";
import { BoardColumn } from "./board-column";
import { TaskDrawer } from "./task-drawer";
import { CreateTaskDialog } from "./create-task-dialog";

interface DragOver {
  status: TaskStatus;
  index: number;
}

export const Board = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const tasks = useAppSelector((state) => state.tasks);
  const members = useAppSelector((state) => state.members);
  const projects = useAppSelector((state) => state.projects);

  const [projectId, setProjectId] = useState(searchParams.get("project") ?? "all");
  const [assigneeId, setAssigneeId] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [search, setSearch] = useState("");

  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [createStatus, setCreateStatus] = useState<TaskStatus | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<DragOver | null>(null);

  // Deep links: ?project=<id>, ?assignee=<id>, ?task=<id>, ?critical=1
  useEffect(() => {
    const project = searchParams.get("project");
    const assignee = searchParams.get("assignee");
    const task = searchParams.get("task");
    const critical = searchParams.get("critical");
    if (project) setProjectId(project);
    if (assignee) setAssigneeId(assignee);
    if (task) setOpenTaskId(task);
    if (critical) setCriticalOnly(true);
    if (project || assignee || task || critical) {
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const membersById = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m])) as Record<string, Member>,
    [members],
  );
  const projectsById = useMemo(
    () => Object.fromEntries(projects.map((p) => [p.id, p])) as Record<string, Project>,
    [projects],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter(
      (task) =>
        (projectId === "all" || task.projectId === projectId) &&
        (assigneeId === "all" || task.assigneeId === assigneeId) &&
        (typeFilter === "all" || task.type === typeFilter) &&
        (!criticalOnly || task.critical) &&
        (query === "" ||
          task.title.toLowerCase().includes(query) ||
          task.code.toLowerCase().includes(query)),
    );
  }, [tasks, projectId, assigneeId, typeFilter, criticalOnly, search]);

  const columns = useMemo(
    () =>
      TASK_STATUS_ORDER.map((status) => ({
        status,
        items: filtered
          .filter((task) => task.status === status)
          .sort((a, b) => a.order - b.order),
      })),
    [filtered],
  );

  const performMove = (status: TaskStatus, index: number) => {
    if (draggingId) {
      dispatch(moveTask({ id: draggingId, toStatus: status, toIndex: index }));
    }
    setDraggingId(null);
    setDragOver(null);
  };

  const activeProject = projects.find((p) => p.id === projectId);
  const hasTasks = filtered.length > 0;

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Task Board</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Drag cards between columns to update status ·{" "}
            <span className="font-medium text-[var(--color-text-primary)]">{filtered.length}</span>{" "}
            tasks
          </p>
        </div>

        <Button
          icon={<Icon icon="solar:add-circle-bold" width={18} />}
          onClick={() => setCreateStatus("in_progress")}
        >
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <Icon
            icon="solar:magnifer-linear"
            width={18}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--color-text-secondary)]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks…"
            className="h-10 w-60 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pr-4 pl-9 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
          />
        </div>

        <Select
          size="sm"
          className="w-44"
          value={projectId}
          onChange={setProjectId}
          options={[
            { value: "all", label: "All Projects" },
            ...projects.map((project) => ({ value: project.id, label: project.name })),
          ]}
        />

        <Select
          size="sm"
          className="w-40"
          value={assigneeId}
          onChange={setAssigneeId}
          options={[
            { value: "all", label: "All Assignees" },
            ...members.map((member) => ({ value: member.id, label: member.name })),
          ]}
        />

        <Select
          size="sm"
          className="w-36"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: "all", label: "All Types" },
            ...TASK_TYPE_ORDER.map((type) => ({ value: type, label: TYPE_META[type].label })),
          ]}
        />

        <button
          type="button"
          onClick={() => setCriticalOnly((prev) => !prev)}
          className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition ${
            criticalOnly
              ? "border-[var(--color-error-300)] bg-[var(--color-error-50)] text-[var(--color-error-600)]"
              : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
          }`}
        >
          <Icon icon="solar:danger-triangle-bold" width={16} />
          Critical
        </button>
      </div>

      {/* Board */}
      {hasTasks ? (
        <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-2">
          {columns.map((column) => (
            <BoardColumn
              key={column.status}
              status={column.status}
              tasks={column.items}
              membersById={membersById}
              projectsById={projectsById}
              showProjectTag={projectId === "all"}
              draggingId={draggingId}
              dragOverIndex={dragOver?.status === column.status ? dragOver.index : null}
              onColumnDragOver={(status, index) => setDragOver({ status, index })}
              onColumnDrop={performMove}
              onColumnDragLeave={(status) =>
                setDragOver((prev) => (prev?.status === status ? null : prev))
              }
              onOpenTask={setOpenTaskId}
              onAddTask={setCreateStatus}
              onCardDragStart={setDraggingId}
              onCardDragEnd={() => {
                setDraggingId(null);
                setDragOver(null);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          className="flex-1"
          icon="solar:clipboard-list-linear"
          title="No tasks match your filters"
          description="Try clearing filters or create a new task to get started."
          action={
            <Button
              variant="outlined"
              onClick={() => setCreateStatus("in_progress")}
              icon={<Icon icon="solar:add-circle-linear" width={18} />}
            >
              New Task
            </Button>
          }
        />
      )}

      <TaskDrawer taskId={openTaskId} onClose={() => setOpenTaskId(null)} />

      <CreateTaskDialog
        open={createStatus !== null}
        onClose={() => setCreateStatus(null)}
        defaultStatus={createStatus ?? "in_progress"}
        defaultProjectId={activeProject?.id}
      />
    </div>
  );
};
