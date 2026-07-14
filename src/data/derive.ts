import type { Task, TaskStatus, TaskType } from "./types";
import { TASK_STATUS_ORDER, TASK_TYPE_ORDER } from "./types";

export const isDone = (status: TaskStatus) => status === "completed";
export const isOpen = (status: TaskStatus) => status !== "completed";

export interface ProgressStat {
  total: number;
  completed: number;
  percent: number;
}

export const progressOf = (tasks: Task[]): ProgressStat => {
  const total = tasks.length;
  const completed = tasks.filter((task) => isDone(task.status)).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent };
};

export const projectProgress = (tasks: Task[], projectId: string): ProgressStat =>
  progressOf(tasks.filter((task) => task.projectId === projectId));

export interface MemberStat {
  total: number;
  completed: number;
  active: number;
  critical: number;
  percent: number;
}

export const memberStats = (tasks: Task[], memberId: string): MemberStat => {
  const owned = tasks.filter((task) => task.assigneeId === memberId);
  const completed = owned.filter((task) => isDone(task.status)).length;
  const active = owned.filter((task) => isOpen(task.status)).length;
  const critical = owned.filter((task) => task.critical && isOpen(task.status)).length;
  const percent = owned.length === 0 ? 0 : Math.round((completed / owned.length) * 100);
  return { total: owned.length, completed, active, critical, percent };
};

export const statusCounts = (tasks: Task[]): Record<TaskStatus, number> => {
  const base = Object.fromEntries(
    TASK_STATUS_ORDER.map((status) => [status, 0]),
  ) as Record<TaskStatus, number>;
  tasks.forEach((task) => {
    base[task.status] += 1;
  });
  return base;
};

export const typeCounts = (tasks: Task[]): Record<TaskType, number> => {
  const base = Object.fromEntries(
    TASK_TYPE_ORDER.map((type) => [type, 0]),
  ) as Record<TaskType, number>;
  tasks.forEach((task) => {
    base[task.type] += 1;
  });
  return base;
};

/**
 * Lightweight "AI" estimate: assume ~2.5 productive days per open task,
 * spread across the members working the project (min 1).
 */
export const estimateDays = (tasks: Task[], memberCount: number) => {
  const open = tasks.filter((task) => isOpen(task.status));
  const weighted = open.reduce((sum, task) => sum + (task.critical ? 3.5 : 2.5), 0);
  const workers = Math.max(1, memberCount);
  return Math.ceil(weighted / workers);
};
