// ----------------------------------------------------------------------

function path(root: string, subLink: string) {
  return `${root}${subLink}`;
}

const ROOTS_AUTH = "/auth";
const ROOTS_DASHBOARD = "/dashboard";

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: "/login",
  forgotPassword: path(ROOTS_AUTH, "/forgot-password"),
  resetPassword: path(ROOTS_AUTH, "/reset-password"),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  overview: path(ROOTS_DASHBOARD, "/overview"),
  projects: path(ROOTS_DASHBOARD, "/projects"),
  board: path(ROOTS_DASHBOARD, "/board"),
  members: path(ROOTS_DASHBOARD, "/members"),
  analytics: path(ROOTS_DASHBOARD, "/analytics"),
  reports: path(ROOTS_DASHBOARD, "/reports"),
};
