import { Icon } from "@iconify/react";
import { PATH_DASHBOARD } from "@app/routes";
import type { NavListProps } from "@app/components/ui/nav-section/types";

const icon = (name: string) => <Icon icon={name} width={20} />;

const navConfig: NavListProps[] = [
  {
    title: "Overview",
    path: PATH_DASHBOARD.overview,
    icon: icon("solar:home-2-linear"),
  },
  {
    title: "Task Board",
    path: PATH_DASHBOARD.board,
    icon: icon("solar:widget-5-linear"),
  },
  {
    title: "Projects",
    path: PATH_DASHBOARD.projects,
    icon: icon("solar:folder-linear"),
  },
  {
    title: "Members",
    path: PATH_DASHBOARD.members,
    icon: icon("solar:users-group-rounded-linear"),
  },
  { title: "divider", path: "#", divider: true },
  {
    title: "Analytics",
    path: PATH_DASHBOARD.analytics,
    icon: icon("solar:chart-2-linear"),
  },
  {
    title: "Reports",
    path: PATH_DASHBOARD.reports,
    icon: icon("solar:document-text-linear"),
  },
];

export default navConfig;
