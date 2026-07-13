import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

import type { IProject } from "./types";

interface Props {
  row: IProject;
  onRowAction?: (
    action: "view" | "edit" | "delete",
    row: IProject
  ) => void;
}

const RowActions = ({ row, onRowAction }: Props) => {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleAction = (
    action: "view" | "edit" | "delete"
  ) => {
    onRowAction?.(action, row);
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg p-2 transition hover:bg-[var(--color-surface-hover)]"
      >
        <Icon
          icon="solar:menu-dots-bold"
          width={20}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">

          <button
            className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--color-surface-hover)]"
            onClick={() => handleAction("view")}
          >
            <Icon icon="solar:eye-bold" width={18} />
            View
          </button>

          <button
            className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-[var(--color-surface-hover)]"
            onClick={() => handleAction("edit")}
          >
            <Icon icon="solar:pen-bold" width={18} />
            Edit
          </button>

          <button
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[var(--color-error-600)] hover:bg-[var(--color-error-50)]"
            onClick={() => handleAction("delete")}
          >
            <Icon icon="solar:trash-bin-trash-bold" width={18} />
            Delete
          </button>

        </div>
      )}
    </div>
  );
};

export { RowActions };