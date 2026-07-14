import { Icon } from "@iconify/react";

import { cn } from "@app/lib";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  icon?: string;
  dot?: string;
  size?: "sm" | "md";
}

export const Badge = ({ children, className, icon, dot, size = "sm" }: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
      size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
      "bg-[var(--color-neutral-150)] text-[var(--color-neutral-600)]",
      className,
    )}
  >
    {dot && (
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} />
    )}
    {icon && <Icon icon={icon} width={size === "sm" ? 13 : 15} />}
    {children}
  </span>
);
