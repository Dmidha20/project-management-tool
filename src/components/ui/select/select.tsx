import { Icon } from "@iconify/react";

import { cn } from "@app/lib";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
}

export const Select = ({
  value,
  onChange,
  options,
  placeholder,
  className,
  size = "md",
}: SelectProps) => (
  <div className={cn("relative", className)}>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pr-10 pl-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:ring-2 focus:ring-[var(--color-primary-300)]",
        size === "sm" ? "h-9" : "h-11",
      )}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>

    <Icon
      icon="solar:alt-arrow-down-linear"
      width={18}
      className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-text-secondary)]"
    />
  </div>
);
