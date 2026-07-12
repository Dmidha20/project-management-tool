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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          {change && (
            <div
              className={`mt-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                trend === "up"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
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

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

export { SummaryCard };