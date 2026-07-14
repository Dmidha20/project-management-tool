import { Icon } from "@iconify/react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  icon = "solar:inbox-line-duotone",
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center ${className}`}
  >
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-neutral-100)] text-[var(--color-neutral-400)]">
      <Icon icon={icon} width={30} />
    </span>

    <div>
      <p className="font-semibold text-[var(--color-text-primary)]">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
      )}
    </div>

    {action}
  </div>
);
