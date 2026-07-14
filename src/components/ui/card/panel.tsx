import { cn } from "@app/lib";

interface PanelProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

export const Panel = ({
  title,
  subtitle,
  action,
  className,
  bodyClassName,
  children,
}: PanelProps) => (
  <section
    className={cn(
      "flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-xs)]",
      className,
    )}
  >
    {(title || action) && (
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {title && (
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h2>
          )}
          {subtitle && (
            <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    )}
    <div className={cn("flex-1", bodyClassName)}>{children}</div>
  </section>
);
