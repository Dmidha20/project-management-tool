import { useState } from "react";
import { Icon } from "@iconify/react";

import type { Project, ProjectStatus, Section } from "@app/data/types";
import { PROJECT_COLORS } from "@app/data/types";
import { Button, Field, Select, TextInput, Textarea, useToast } from "@app/components/ui";
import { DialogLayout } from "@app/components/layouts/popup/dialog-layout";
import { useAppDispatch, useAppSelector } from "@app/store";
import { addProject } from "@app/store/slices/projects-slice";
import { cn, uid } from "@app/lib";
import { MemberPicker } from "../components/member-picker";

const STATUS_OPTIONS: ProjectStatus[] = ["Planning", "Active", "On Hold", "Completed"];

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateProjectDialog = ({ open, onClose }: CreateProjectDialogProps) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const members = useAppSelector((state) => state.members);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [status, setStatus] = useState<ProjectStatus>("Planning");
  const [dueDate, setDueDate] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [sectionsText, setSectionsText] = useState("");

  const reset = () => {
    setName("");
    setCode("");
    setDescription("");
    setColor(PROJECT_COLORS[0]);
    setStatus("Planning");
    setDueDate("");
    setMemberIds([]);
    setSectionsText("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCreate = () => {
    if (!name.trim()) return;

    const sections: Section[] = sectionsText
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((sectionName) => ({ id: uid("sec"), name: sectionName }));

    const project: Project = {
      id: uid("proj"),
      code: (code.trim() || name.trim().slice(0, 3)).toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      color,
      status,
      memberIds,
      sections,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || undefined,
    };

    dispatch(addProject(project));
    toast(`Project “${project.name}” created`);
    handleClose();
  };

  return (
    <DialogLayout
      open={open}
      onClose={handleClose}
      title="Create Project"
      description="Set up a new project and assign your team"
      dialogClass="!w-[620px]"
      footer={
        <>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create Project
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <Field label="Project Name" required>
          <TextInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Riverside Tower"
            autoFocus
          />
        </Field>

        <Field label="Code" hint="Short prefix used on tasks">
          <TextInput
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="RVT"
            maxLength={5}
          />
        </Field>

        <Field label="Description" className="col-span-2">
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this project about?"
            rows={2}
          />
        </Field>

        <Field label="Status">
          <Select
            value={status}
            onChange={(value) => setStatus(value as ProjectStatus)}
            options={STATUS_OPTIONS.map((value) => ({ value, label: value }))}
          />
        </Field>

        <Field label="Due Date">
          <TextInput
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </Field>

        <Field label="Accent Color" className="col-span-2">
          <div className="flex flex-wrap gap-2">
            {PROJECT_COLORS.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => setColor(swatch)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition",
                  color === swatch && "ring-2 ring-offset-2 ring-[var(--color-neutral-400)]",
                )}
                style={{ backgroundColor: swatch }}
              >
                {color === swatch && <Icon icon="solar:check-read-bold" width={16} color="#fff" />}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Sections" hint="Comma separated, e.g. Architecture, Structural, MEP" className="col-span-2">
          <TextInput
            value={sectionsText}
            onChange={(event) => setSectionsText(event.target.value)}
            placeholder="Architecture, Structural, MEP"
          />
        </Field>

        <Field label={`Members (${memberIds.length})`} className="col-span-2">
          <MemberPicker members={members} selected={memberIds} onChange={setMemberIds} />
        </Field>
      </div>
    </DialogLayout>
  );
};
