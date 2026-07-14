import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

const LoginPage = lazy(() => import("@app/pages/login"));
const DashboardLayout = lazy(
  () => import("@app/components/layouts/dashboard/dashboard-layout"),
);

const Overview = lazy(() => import("@app/pages/dashboard/overview"));
const Projects = lazy(() => import("@app/pages/dashboard/projects"));
const Sections = lazy(() => import("@app/pages/dashboard/sections"));
const Board = lazy(() => import("@app/pages/dashboard/tasks"));
const Members = lazy(() => import("@app/pages/dashboard/members"));
const Analytics = lazy(() => import("@app/pages/dashboard/analytics"));
const Reports = lazy(() => import("@app/pages/dashboard/reports"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard/overview" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: "overview", element: <Overview /> },
      { path: "projects", element: <Projects /> },
      { path: "sections", element: <Sections /> },
      { path: "board", element: <Board /> },
      { path: "members", element: <Members /> },
      { path: "analytics", element: <Analytics /> },
      { path: "reports", element: <Reports /> },
      { path: "*", element: <Navigate to="overview" replace /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
