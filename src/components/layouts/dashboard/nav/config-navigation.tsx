import { Icon } from "@iconify/react";
import { PATH_DASHBOARD } from "@app/routes";
import type { NavListProps } from "@app/components/ui/nav-section/types";

const icon = (name: string) => <Icon icon={name} width={20} />;

const navConfig: NavListProps[] = [
  { title: "Dashboard", path: PATH_DASHBOARD.app, icon: icon("solar:home-2-linear") },
  { title: "Projects", path: "/dashboard/projects", icon: icon("solar:folder-linear") },
  { title: "Sections", path: "/dashboard/sections", icon: icon("solar:layers-linear") },
  { title: "Tasks", path: "/dashboard/tasks", icon: icon("solar:check-square-linear") },
  { title: "My Tasks", path: "/dashboard/my-tasks", icon: icon("solar:user-check-linear") },
  { title: "Members", path: "/dashboard/members", icon: icon("solar:users-group-rounded-linear") },
  { title: "Chat", path: "/dashboard/chat", icon: icon("solar:chat-round-dots-linear") },
  { title: "divider", path: "#", divider: true },
  { title: "Role & Access", path: PATH_DASHBOARD.role_and_access, icon: icon("solar:shield-keyhole-linear") },
  { title: "Notifications", path: "/dashboard/notifications", icon: icon("solar:bell-linear"), info: "3" },
  { title: "Settings", path: "/dashboard/settings", icon: icon("solar:settings-linear") },
];

export default navConfig;
