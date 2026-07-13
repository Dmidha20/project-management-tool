import { Suspense, useEffect, useState, type JSX } from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";

import Main from "./main";
import navConfig from "./nav/config-navigation";
import NavVertical from "./nav/nav-vertical";
import { Iconify, Loader } from "@app/components/ui";

// ----------------------------------------------------------------------
interface NavItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const PageLoader = () => <Loader loading>{null}</Loader>;

const PageFallback = () => (
  <div className="min-h-[calc(100vh-64px)] w-full">
    <PageLoader />
  </div>
);

export default function DashboardLayout() {
  const [isDrawerOpen, setDrawerOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!isDrawerOpen);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const location = useLocation();
  const { pathname } = location;
  const navigation = useNavigation();
  const isRouteLoading = navigation.state !== "idle";

  const findItemByPath = (
    navItems: NavItem[],
    path: string,
  ): NavItem | null => {
    for (const navConfig of navItems) {
      if (navConfig.path === path) return navConfig;
      if (navConfig.children) {
        const childItem = findItemByPath(navConfig.children, path);
        if (childItem) return childItem;
      }
    }

    return null;
  };

  const currentItem = findItemByPath(navConfig, pathname);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const pageTitle = currentItem ? currentItem.title : "Burjeel Health";

  const renderNavVertical = (
    <NavVertical
      openNav={isDrawerOpen}
      onCloseNav={toggleDrawer}
      collapsed={isCollapsed}
      onToggleCollapse={toggleCollapse}
    />
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-50 flex items-center p-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] sm:hidden">
        <button
          onClick={toggleDrawer}
          className="p-2 rounded-md hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
        >
          <Iconify icon="oi:menu" className="w-6 h-6" />
        </button>
        <h1 className="ml-4 text-xl font-semibold">{pageTitle}</h1>
      </div>
      <div className="flex flex-row h-screen">
        <div className="z-[50]">{renderNavVertical}</div>
        <Main
          className="relative"
          style={{
            transition: "margin-left 0.3s",
            marginLeft: isCollapsed ? "88px" : "280px",
          }}
        >
          {isRouteLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--color-surface)]/70">
              <PageLoader />
            </div>
          )}
          <Suspense key={location.key} fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </Main>
      </div>
    </div>
  );
}
