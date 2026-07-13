import { Icon } from "@iconify/react";

import type { SummaryCardProps } from "./types";

const SummaryCard = ({
  title,
  value,
  icon,
  change,
  trend = "up",
}: SummaryCardProps) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">{title}</p>

          <h2 className="mt-3 text-3xl font-bold text-[var(--color-text-primary)]">
            {value}
          </h2>

          {change && (
            <div
              className={`mt-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                trend === "up"
                  ? "bg-[var(--color-success-100)] text-[var(--color-success-700)]"
                  : "bg-[var(--color-error-100)] text-[var(--color-error-600)]"
              }`}
            >
              <Icon
                icon={
                  trend === "up"
                    ? "solar:arrow-up-bold"
                    : "solar:arrow-down-bold"
                }
                width={14}
              />

              {change}
            </div>
          )}
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-100)] text-[var(--color-primary)]">
          {icon}
        </div>
      </div>
    </div>
  );
};

export { SummaryCard };
