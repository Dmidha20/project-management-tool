import { colorFromString, initials, cn } from "@app/lib";

type AvatarSize = "xs" | "sm" | "md" | "lg";

const SIZES: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

interface AvatarProps {
  name: string;
  size?: AvatarSize;
  className?: string;
  ring?: boolean;
}

export const Avatar = ({ name, size = "md", className, ring }: AvatarProps) => (
  <span
    title={name}
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none",
      SIZES[size],
      ring && "ring-2 ring-[var(--color-surface)]",
      className,
    )}
    style={{ backgroundColor: colorFromString(name) }}
  >
    {initials(name)}
  </span>
);

interface AvatarGroupProps {
  names: string[];
  max?: number;
  size?: AvatarSize;
}

export const AvatarGroup = ({ names, max = 4, size = "sm" }: AvatarGroupProps) => {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;

  return (
    <div className="flex items-center -space-x-2">
      {shown.map((name, index) => (
        <Avatar key={`${name}-${index}`} name={name} size={size} ring />
      ))}

      {extra > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-[var(--color-neutral-200)] font-semibold text-[var(--color-neutral-600)] ring-2 ring-[var(--color-surface)]",
            SIZES[size],
          )}
        >
          +{extra}
        </span>
      )}
    </div>
  );
};
