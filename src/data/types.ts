// ----------------------------------------------------------------------
// Domain model for the Project Management demo
// ----------------------------------------------------------------------

export type Role = "Admin" | "Manager" | "Member";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
}

export interface Section {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  status: ProjectStatus;
  memberIds: string[];
  sections: Section[];
  createdAt: string;
  dueDate?: string;
}

export type ProjectStatus = "Planning" | "Active" | "On Hold" | "Completed";

// ----------------------------------------------------------------------

export type TaskStatus =
  | "in_progress"
  | "review_1"
  | "review_2"
  | "rework"
  | "on_hold"
  | "completed";

export type TaskType = "modeling" | "drawing" | "closeout";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export type LinkKind = "gsheet" | "gdoc" | "excel" | "word" | "link";

export interface TaskLink {
  id: string;
  label: string;
  url: string;
  kind: LinkKind;
}

export interface Attachment {
  id: string;
  name: string;
  /** data URL for uploaded images, otherwise a placeholder swatch */
  url: string;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  code: string;
  projectId: string;
  sectionId?: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  critical: boolean;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  attachments: Attachment[];
  links: TaskLink[];
  checklist: ChecklistItem[];
  comments: Comment[];
}

export interface AppNotification {
  id: string;
  message: string;
  taskId?: string;
  createdAt: string;
  read: boolean;
}

// ----------------------------------------------------------------------
// Display configuration
// ----------------------------------------------------------------------

export interface StatusMeta {
  label: string;
  /** solid dot / accent color (raw css value) */
  accent: string;
  /** badge (soft) classes */
  badge: string;
  /** column header soft background */
  soft: string;
}

export const TASK_STATUS_ORDER: TaskStatus[] = [
  "in_progress",
  "review_1",
  "review_2",
  "rework",
  "on_hold",
  "completed",
];

export const STATUS_META: Record<TaskStatus, StatusMeta> = {
  in_progress: {
    label: "In Progress",
    accent: "var(--color-primary-500)",
    badge: "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",
    soft: "bg-[var(--color-primary-50)]",
  },
  review_1: {
    label: "Review #1",
    accent: "var(--color-warning-500)",
    badge: "bg-[var(--color-warning-100)] text-[var(--color-warning-700)]",
    soft: "bg-[var(--color-warning-50)]",
  },
  review_2: {
    label: "Review #2",
    accent: "var(--color-info-500)",
    badge: "bg-[var(--color-info-100)] text-[var(--color-info-700)]",
    soft: "bg-[var(--color-info-50)]",
  },
  rework: {
    label: "Rework",
    accent: "var(--color-error-500)",
    badge: "bg-[var(--color-error-100)] text-[var(--color-error-600)]",
    soft: "bg-[var(--color-error-50)]",
  },
  on_hold: {
    label: "On Hold",
    accent: "var(--color-neutral-400)",
    badge: "bg-[var(--color-neutral-150)] text-[var(--color-neutral-600)]",
    soft: "bg-[var(--color-neutral-50)]",
  },
  completed: {
    label: "Completed",
    accent: "var(--color-success-500)",
    badge: "bg-[var(--color-success-100)] text-[var(--color-success-700)]",
    soft: "bg-[var(--color-success-50)]",
  },
};

export interface TypeMeta {
  label: string;
  icon: string;
  badge: string;
}

export const TASK_TYPE_ORDER: TaskType[] = ["modeling", "drawing", "closeout"];

export const TYPE_META: Record<TaskType, TypeMeta> = {
  modeling: {
    label: "Modeling",
    icon: "solar:box-bold-duotone",
    badge: "bg-[var(--color-info-100)] text-[var(--color-info-700)]",
  },
  drawing: {
    label: "Drawing",
    icon: "solar:ruler-pen-bold-duotone",
    badge: "bg-[var(--color-warning-100)] text-[var(--color-warning-700)]",
  },
  closeout: {
    label: "Closeout",
    icon: "solar:clipboard-check-bold-duotone",
    badge: "bg-[var(--color-success-100)] text-[var(--color-success-700)]",
  },
};

export interface LinkMeta {
  label: string;
  icon: string;
  color: string;
}

export const LINK_META: Record<LinkKind, LinkMeta> = {
  gsheet: { label: "Google Sheet", icon: "solar:chart-2-bold-duotone", color: "var(--color-success-600)" },
  excel: { label: "Excel", icon: "solar:chart-2-bold-duotone", color: "var(--color-success-700)" },
  gdoc: { label: "Google Doc", icon: "solar:document-text-bold-duotone", color: "var(--color-info-600)" },
  word: { label: "Word", icon: "solar:document-text-bold-duotone", color: "var(--color-primary-600)" },
  link: { label: "Link", icon: "solar:link-round-bold-duotone", color: "var(--color-neutral-500)" },
};

export const ROLE_META: Record<Role, { badge: string; icon: string }> = {
  Admin: {
    badge: "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",
    icon: "solar:shield-keyhole-bold-duotone",
  },
  Manager: {
    badge: "bg-[var(--color-info-100)] text-[var(--color-info-700)]",
    icon: "solar:user-id-bold-duotone",
  },
  Member: {
    badge: "bg-[var(--color-neutral-150)] text-[var(--color-neutral-600)]",
    icon: "solar:user-bold-duotone",
  },
};

export const PROJECT_STATUS_META: Record<ProjectStatus, string> = {
  Planning: "bg-[var(--color-neutral-150)] text-[var(--color-neutral-600)]",
  Active: "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",
  "On Hold": "bg-[var(--color-warning-100)] text-[var(--color-warning-700)]",
  Completed: "bg-[var(--color-success-100)] text-[var(--color-success-700)]",
};

/** Project accent color palette (used when creating projects) */
export const PROJECT_COLORS = [
  "#4F46E5",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];
