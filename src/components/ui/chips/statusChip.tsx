import clsx from "clsx";

interface StatusChipProps {
  status:
    | "Planning"
    | "In Progress"
    | "Review"
    | "Completed"
    | "Blocked";
}

const statusClasses = {
  Planning:
    "bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]",

  "In Progress":
    "bg-[var(--color-primary-100)] text-[var(--color-primary-700)]",

  Review:
    "bg-[var(--color-warning-100)] text-[var(--color-warning-700)]",

  Completed:
    "bg-[var(--color-success-100)] text-[var(--color-success-700)]",

  Blocked:
    "bg-[var(--color-error-100)] text-[var(--color-error-700)]",
};

const StatusChip = ({ status }: StatusChipProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        statusClasses[status]
      )}
    >
      {status}
    </span>
  );
};

export { StatusChip };