import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATH_DASHBOARD } from "./paths";

const LoginPage = lazy(() => import("@app/pages/login"));
const DashboardLayout = lazy(
  () => import("@app/components/layouts/dashboard/dashboard-layout")
);
const DashboardPage = lazy(() => import("@app/pages/dashboard"));
const ProjectListPage = lazy(()=> import("@app/pages/projects"))

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
       {
        path:PATH_DASHBOARD.projects,
        element: <ProjectListPage />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);