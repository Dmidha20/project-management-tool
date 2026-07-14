import { useMemo, useState } from "react";

import type { Task, TaskStatus, TaskType } from "@app/data/types";
import { STATUS_META, TASK_STATUS_ORDER, TASK_TYPE_ORDER, TYPE_META } from "@app/data/types";
import { Button, Field, Select, TextInput, Textarea, useToast } from "@app/components/ui";
import { DialogLayout } from "@app/components/layouts/popup/dialog-layout";
import { useAppDispatch, useAppSelector } from "@app/store";
import { addTask } from "@app/store/slices/tasks-slice";
import { pushNotification } from "@app/store/slices/notifications-slice";
import { uid } from "@app/lib";

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
  defaultProjectId?: string;
}

export const CreateTaskDialog = ({
  open,
  onClose,
  defaultStatus = "in_progress",
  defaultProjectId,
}: CreateTaskDialogProps) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const projects = useAppSelector((state) => state.projects);
  const members = useAppSelector((state) => state.members);
  const tasks = useAppSelector((state) => state.tasks);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(defaultProjectId ?? projects[0]?.id ?? "");
  const [sectionId, setSectionId] = useState("");
  const [type, setType] = useState<TaskType>("modeling");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [critical, setCritical] = useState(false);

  const project = projects.find((item) => item.id === projectId);

  const nextCode = useMemo(() => {
    const max = tasks.reduce((acc, task) => {
      const num = Number(task.code.replace(/\D/g, ""));
      return Number.isFinite(num) ? Math.max(acc, num) : acc;
    }, 100);
    return `TSK-${max + 1}`;
  }, [tasks]);

  const assignableMembers = members.filter((member) =>
    project ? project.memberIds.includes(member.id) : true,
  );

  const reset = () => {
    setTitle("");
    setDescription("");
    setSectionId("");
    setType("modeling");
    setAssigneeId("");
    setDueDate("");
    setCritical(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCreate = () => {
    if (!title.trim() || !projectId) return;
    const now = new Date().toISOString();

    const task: Task = {
      id: uid("task"),
      code: nextCode,
      projectId,
      sectionId: sectionId || undefined,
      title: title.trim(),
      description: description.trim(),
      type,
      status,
      critical,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
      createdAt: now,
      updatedAt: now,
      order: 0,
      attachments: [],
      links: [],
      checklist:
        type === "closeout"
          ? [
              { id: uid("ck"), text: "Clash report cleared", done: false },
              { id: uid("ck"), text: "Model audited", done: false },
              { id: uid("ck"), text: "Drawings issued", done: false },
              { id: uid("ck"), text: "Sign-off recorded", done: false },
            ]
          : [],
      comments: [],
    };

    dispatch(addTask(task));

    const assignee = members.find((member) => member.id === assigneeId);
    if (assignee) {
      dispatch(
        pushNotification({
          id: uid("notif"),
          message: `“${task.title}” was assigned to ${assignee.name}`,
          taskId: task.id,
          createdAt: now,
          read: false,
        }),
      );
    }

    toast(`Task ${task.code} created`);
    handleClose();
  };

  return (
    <DialogLayout
      open={open}
      onClose={handleClose}
      title="Create Task"
      description="Add a new task to the board"
      dialogClass="!w-[640px]"
      footer={
        <>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || !projectId}>
            Create Task
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <Field label="Task Title" required className="col-span-2">
          <TextInput
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Model level 8 ductwork"
            autoFocus
          />
        </Field>

        <Field label="Description" className="col-span-2">
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the work to be done…"
            rows={3}
          />
        </Field>

        <Field label="Project" required>
          <Select
            value={projectId}
            onChange={(value) => {
              setProjectId(value);
              setSectionId("");
              setAssigneeId("");
            }}
            options={projects.map((item) => ({ value: item.id, label: item.name }))}
          />
        </Field>

        <Field label="Section">
          <Select
            value={sectionId}
            onChange={setSectionId}
            placeholder="No section"
            options={(project?.sections ?? []).map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </Field>

        <Field label="Type">
          <Select
            value={type}
            onChange={(value) => setType(value as TaskType)}
            options={TASK_TYPE_ORDER.map((value) => ({
              value,
              label: TYPE_META[value].label,
            }))}
          />
        </Field>

        <Field label="Status">
          <Select
            value={status}
            onChange={(value) => setStatus(value as TaskStatus)}
            options={TASK_STATUS_ORDER.map((value) => ({
              value,
              label: STATUS_META[value].label,
            }))}
          />
        </Field>

        <Field label="Assignee">
          <Select
            value={assigneeId}
            onChange={setAssigneeId}
            placeholder="Unassigned"
            options={assignableMembers.map((member) => ({
              value: member.id,
              label: member.name,
            }))}
          />
        </Field>

        <Field label="Due Date">
          <TextInput
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </Field>

        <label className="col-span-2 flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3">
          <input
            type="checkbox"
            checked={critical}
            onChange={(event) => setCritical(event.target.checked)}
            className="h-4 w-4 accent-[var(--color-error-500)]"
          />
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            Mark as critical
          </span>
          <span className="text-xs text-[var(--color-text-secondary)]">
            Highlights the task and surfaces it in reports
          </span>
        </label>
      </div>
    </DialogLayout>
  );
};
