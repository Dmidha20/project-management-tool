import { cn } from "@app/lib";

interface ProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  color?: string;
}

export const Progress = ({ value, className, barClassName, color }: ProgressProps) => {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[var(--color-neutral-150)]",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500", barClassName)}
        style={{
          width: `${clamped}%`,
          backgroundColor: color ?? "var(--color-primary-500)",
        }}
      />
    </div>
  );
};
