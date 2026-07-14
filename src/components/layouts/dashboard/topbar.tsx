import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import { CURRENT_USER_ID } from "@app/data/seed";
import { Avatar } from "@app/components/ui";
import { useAppDispatch, useAppSelector } from "@app/store";
import { resetDemoData } from "@app/store/store";
import { markAllRead } from "@app/store/slices/notifications-slice";
import { relativeTime } from "@app/lib";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Your workspace at a glance" },
  projects: { title: "Projects", subtitle: "Plan and organise your work" },
  board: { title: "Task Board", subtitle: "Track tasks across statuses" },
  members: { title: "Members", subtitle: "Your team and their workload" },
  analytics: { title: "Analytics", subtitle: "Insights and forecasts" },
  reports: { title: "Reports", subtitle: "Grouped task breakdowns" },
};

export const Topbar = ({ onMenu }: { onMenu?: () => void }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const notifications = useAppSelector((state) => state.notifications);
  const currentUser = useAppSelector((state) =>
    state.members.find((member) => member.id === CURRENT_USER_ID),
  );

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const segment = pathname.split("/")[2] ?? "overview";
  const meta = TITLES[segment] ?? TITLES.overview;
  const unread = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const openNotifications = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next && unread > 0) {
        setTimeout(() => dispatch(markAllRead()), 1200);
      }
      return next;
    });
  };

  const handleReset = () => {
    if (window.confirm("Reset the demo to its original sample data?")) {
      resetDemoData();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/85 px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        {onMenu && (
          <button
            type="button"
            onClick={onMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-150)] sm:hidden"
            aria-label="Open navigation"
          >
            <Icon icon="solar:hamburger-menu-linear" width={22} />
          </button>
        )}
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{meta.title}</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-neutral-150)] hover:text-[var(--color-text-primary)] sm:inline-flex"
        >
          <Icon icon="solar:refresh-linear" width={16} />
          Reset demo
        </button>

        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={openNotifications}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[var(--color-text-secondary)] transition hover:bg-[var(--color-neutral-150)] hover:text-[var(--color-text-primary)]"
          >
            <Icon icon="solar:bell-linear" width={20} />
            {unread > 0 && (
              <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-error-500)] px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">Notifications</p>
                {notifications.length > 0 && (
                  <button
                    type="button"
                    onClick={() => dispatch(markAllRead())}
                    className="text-xs font-medium text-[var(--color-primary)] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-[var(--color-text-secondary)]">
                    You're all caught up.
                  </p>
                )}

                {notifications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      if (item.taskId) navigate(`/dashboard/board?task=${item.taskId}`);
                    }}
                    className="flex w-full items-start gap-3 border-b border-[var(--color-divider)] px-4 py-3 text-left transition last:border-0 hover:bg-[var(--color-neutral-100)]"
                  >
                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        item.read ? "bg-[var(--color-neutral-300)]" : "bg-[var(--color-primary)]"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-[var(--color-text-primary)]">{item.message}</p>
                      <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                        {relativeTime(item.createdAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {currentUser && (
          <div className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] py-1.5 pl-1.5 pr-3">
            <Avatar name={currentUser.name} size="sm" />
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {currentUser.name}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">{currentUser.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
