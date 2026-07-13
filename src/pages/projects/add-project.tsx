import { useEffect, useMemo, useRef, useState } from "react";

import { Button, Iconify } from "@app/components/ui";
import { DialogLayout } from "@app/components/layouts/popup/dialog-layout";
import type { IProject } from "./types";

const TEAM_MEMBERS = [
  { id: "u1", name: "Alice Johnson" },
  { id: "u2", name: "David Kim" },
  { id: "u3", name: "Priya Patel" },
  { id: "u4", name: "Marcus Lee" },
  { id: "u5", name: "Sofia Rossi" },
];

const PRIORITY_OPTIONS: IProject["priority"][] = ["Low", "Medium", "High"];
const STATUS_OPTIONS: IProject["status"][] = [
  "Planning",
  "In Progress",
  "Review",
  "Completed",
];

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

const Field = ({ label, required, children }: FieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-[var(--color-text-primary)]">
      {label}
      {required && <span className="ml-0.5 text-[var(--color-error-600)]">*</span>}
    </label>

    {children}
  </div>
);

const inputClass =
  "h-11 w-full rounded-xl border border-[var(--color-border)] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]";

const selectClass = `${inputClass} appearance-none pr-10`;

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}

const SelectField = ({ value, onChange, placeholder, options }: SelectFieldProps) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={selectClass}
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

    <Iconify
      icon="solar:alt-arrow-down-linear"
      className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[var(--color-text-secondary)]"
    />
  </div>
);

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const DateField = ({ value, onChange }: DateFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0`}
      />

      <Iconify
        icon="solar:calendar-linear"
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[var(--color-text-secondary)]"
      />
    </div>
  );
};

interface MembersFieldProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

const MembersField = ({ selected, onChange }: MembersFieldProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const toggleMember = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((memberId) => memberId !== id)
        : [...selected, id],
    );
  };

  const label =
    selected.length === 0
      ? "Select members"
      : TEAM_MEMBERS.filter((member) => selected.includes(member.id))
          .map((member) => member.name)
          .join(", ");

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputClass} flex items-center justify-between text-left`}
      >
        <span
          className={`truncate ${
            selected.length === 0 ? "text-[var(--color-text-secondary)]" : ""
          }`}
        >
          {label}
        </span>

        <Iconify
          icon="solar:alt-arrow-down-linear"
          className="shrink-0 text-[var(--color-text-secondary)]"
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
          {TEAM_MEMBERS.map((member) => (
            <label
              key={member.id}
              className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--color-surface-hover)]"
            >
              <input
                type="checkbox"
                checked={selected.includes(member.id)}
                onChange={() => toggleMember(member.id)}
                className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary-300)]"
              />

              {member.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

interface ImageFieldProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

const ImageField = ({ file, onChange }: ImageFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-[92px] w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[var(--color-border)] text-center hover:bg-[var(--color-surface-hover)]"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Project" className="h-full w-full rounded-xl object-cover" />
        ) : (
          <>
            <Iconify icon="solar:cloud-upload-linear" size={24} className="text-[var(--color-text-secondary)]" />

            <span className="text-sm font-medium">Click to upload image</span>

            <span className="text-xs text-[var(--color-text-secondary)]">PNG, JPG up to 2MB</span>
          </>
        )}
      </button>

      {previewUrl && (
        <Button
          variant="clear"
          onClick={() => onChange(null)}
          className="!absolute top-1.5 right-1.5 !p-1 bg-[var(--color-surface)]/90 rounded-full"
        >
          <Iconify icon="ic:outline-close" size={16} />
        </Button>
      )}
    </div>
  );
};

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate?: (project: IProject) => void;
}

const AddProject = ({ open, onClose, onCreate }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [priority, setPriority] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isValid = Boolean(name && owner && priority && status);

  const resetForm = () => {
    setName("");
    setDescription("");
    setOwner("");
    setPriority("");
    setStatus("");
    setStartDate("");
    setDueDate("");
    setMemberIds([]);
    setImageFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = () => {
    if (!isValid) return;

    onCreate?.({
      id: `PRJ-${Date.now()}`,
      name,
      owner,
      priority: priority as IProject["priority"],
      status: status as IProject["status"],
      progress: 0,
      members: memberIds.length,
      dueDate,
    });

    handleClose();
  };

  return (
    <DialogLayout
      open={open}
      onClose={handleClose}
      title="Add New Project"
      description="Fill in the details to create a new project"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>

          <Button onClick={handleCreate} disabled={!isValid}>
            Create Project
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <Field label="Project Name" required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            className={inputClass}
          />
        </Field>

        <Field label="Owner" required>
          <SelectField
            value={owner}
            onChange={setOwner}
            placeholder="Select project owner"
            options={TEAM_MEMBERS.map((member) => member.name)}
          />
        </Field>

        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            rows={4}
            className="w-full resize-none rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
          />
        </Field>

        <div className="flex flex-col gap-5">
          <Field label="Priority" required>
            <SelectField
              value={priority}
              onChange={setPriority}
              placeholder="Select priority"
              options={PRIORITY_OPTIONS}
            />
          </Field>

          <Field label="Status" required>
            <SelectField
              value={status}
              onChange={setStatus}
              placeholder="Select status"
              options={STATUS_OPTIONS}
            />
          </Field>
        </div>

        <Field label="Start Date">
          <DateField value={startDate} onChange={setStartDate} />
        </Field>

        <Field label="Due Date">
          <DateField value={dueDate} onChange={setDueDate} />
        </Field>

        <Field label="Members">
          <MembersField selected={memberIds} onChange={setMemberIds} />
        </Field>

        <Field label="Project Image">
          <ImageField file={imageFile} onChange={setImageFile} />
        </Field>
      </div>
    </DialogLayout>
  );
};

export { AddProject };
