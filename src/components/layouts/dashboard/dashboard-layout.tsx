import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";

import Main from "./main";
import NavVertical from "./nav/nav-vertical";
import { Topbar } from "./topbar";
import { Loader } from "@app/components/ui";
import { useResponsive } from "@app/hooks/use-responsive";

const PageLoader = () => <Loader loading>{null}</Loader>;

const PageFallback = () => (
  <div className="min-h-[calc(100vh-64px)] w-full">
    <PageLoader />
  </div>
);

export default function DashboardLayout() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const location = useLocation();
  const { pathname } = location;
  const navigation = useNavigation();
  const isRouteLoading = navigation.state !== "idle";
  const isMobile = useResponsive("down", "sm");

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen flex-row overflow-hidden bg-[var(--color-background)]">
      <div className="z-50">
        <NavVertical
          openNav={isDrawerOpen}
          onCloseNav={toggleDrawer}
          collapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>

      <Main
        className="relative"
        style={{
          transition: "margin-left 0.3s",
          marginLeft: isMobile ? 0 : isCollapsed ? "88px" : "280px",
        }}
      >
        <Topbar onMenu={toggleDrawer} />

        {isRouteLoading && (
          <div className="absolute inset-0 top-16 z-20 flex items-center justify-center bg-[var(--color-surface)]/70">
            <PageLoader />
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto">
          <Suspense key={location.key} fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </Main>
    </div>
  );
}
