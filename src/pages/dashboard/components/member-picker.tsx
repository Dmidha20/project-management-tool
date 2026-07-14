import { Icon } from "@iconify/react";

import type { Member } from "@app/data/types";
import { Avatar } from "@app/components/ui";
import { cn } from "@app/lib";

interface MemberPickerProps {
  members: Member[];
  selected: string[];
  onChange: (ids: string[]) => void;
}

export const MemberPicker = ({ members, selected, onChange }: MemberPickerProps) => {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((m) => m !== id) : [...selected, id]);

  return (
    <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-[var(--color-border)] p-1.5">
      {members.map((member) => {
        const isSelected = selected.includes(member.id);
        return (
          <button
            key={member.id}
            type="button"
            onClick={() => toggle(member.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition",
              isSelected ? "bg-[var(--color-primary-50)]" : "hover:bg-[var(--color-neutral-100)]",
            )}
          >
            <Avatar name={member.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                {member.name}
              </p>
              <p className="truncate text-xs text-[var(--color-text-secondary)]">{member.title}</p>
            </div>
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-md border transition",
                isSelected
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-border)]",
              )}
            >
              {isSelected && <Icon icon="solar:check-read-linear" width={14} />}
            </span>
          </button>
        );
      })}
    </div>
  );
};
