import { useRef, useState } from "react";
import { Icon } from "@iconify/react";

import type { LinkKind, TaskStatus, TaskType } from "@app/data/types";
import {
  LINK_META,
  STATUS_META,
  TASK_STATUS_ORDER,
  TASK_TYPE_ORDER,
  TYPE_META,
} from "@app/data/types";
import { CURRENT_USER_ID } from "@app/data/seed";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Progress,
  Select,
  useToast,
} from "@app/components/ui";
import { useAppDispatch, useAppSelector } from "@app/store";
import {
  addAttachment,
  addChecklistItem,
  addComment,
  addLink,
  removeAttachment,
  removeChecklistItem,
  removeLink,
  removeTask,
  toggleChecklistItem,
  toggleCritical,
  updateTask,
} from "@app/store/slices/tasks-slice";
import { pushNotification } from "@app/store/slices/notifications-slice";
import { cn, formatDate, relativeTime, uid } from "@app/lib";

interface TaskDrawerProps {
  taskId: string | null;
  onClose: () => void;
}

const SectionLabel = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)]">
    <Icon icon={icon} width={17} className="text-[var(--color-text-secondary)]" />
    {children}
  </div>
);

export const TaskDrawer = ({ taskId, onClose }: TaskDrawerProps) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const task = useAppSelector((state) => state.tasks.find((item) => item.id === taskId));
  const members = useAppSelector((state) => state.members);
  const project = useAppSelector((state) =>
    state.projects.find((item) => item.id === task?.projectId),
  );

  const [comment, setComment] = useState("");
  const [checklistText, setChecklistText] = useState("");
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkKind, setLinkKind] = useState<LinkKind>("gsheet");
  const fileRef = useRef<HTMLInputElement>(null);

  const open = Boolean(task);

  const section = project?.sections.find((item) => item.id === task?.sectionId);
  const checklistDone = task?.checklist.filter((c) => c.done).length ?? 0;

  const handleAssign = (memberId: string) => {
    if (!task) return;
    dispatch(updateTask({ id: task.id, assigneeId: memberId || undefined }));
    const member = members.find((m) => m.id === memberId);
    if (member) {
      dispatch(
        pushNotification({
          id: uid("notif"),
          message: `“${task.title}” was assigned to ${member.name}`,
          taskId: task.id,
          createdAt: new Date().toISOString(),
          read: false,
        }),
      );
      toast(`Assigned to ${member.name}`, "info");
    }
  };

  const handleSendComment = () => {
    if (!task || !comment.trim()) return;
    dispatch(
      addComment({
        taskId: task.id,
        comment: {
          id: uid("cmt"),
          authorId: CURRENT_USER_ID,
          text: comment.trim(),
          createdAt: new Date().toISOString(),
        },
      }),
    );
    setComment("");
  };

  const handleAddChecklist = () => {
    if (!task || !checklistText.trim()) return;
    dispatch(
      addChecklistItem({
        taskId: task.id,
        item: { id: uid("ck"), text: checklistText.trim(), done: false },
      }),
    );
    setChecklistText("");
  };

  const handleAddLink = () => {
    if (!task || !linkLabel.trim() || !linkUrl.trim()) return;
    dispatch(
      addLink({
        taskId: task.id,
        link: { id: uid("lnk"), label: linkLabel.trim(), url: linkUrl.trim(), kind: linkKind },
      }),
    );
    setLinkLabel("");
    setLinkUrl("");
    setShowLinkForm(false);
    toast("Document linked");
  };

  const handleUpload = (files: FileList | null) => {
    if (!task || !files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        dispatch(
          addAttachment({
            taskId: task.id,
            attachment: { id: uid("att"), name: file.name, url: String(reader.result) },
          }),
        );
      };
      reader.readAsDataURL(file);
    });
    toast("Image attached");
  };

  const handleDelete = () => {
    if (!task) return;
    dispatch(removeTask(task.id));
    toast("Task deleted", "error");
    onClose();
  };

  return (
    <Drawer open={open} onClose={onClose} width={560}>
      {task && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
            <div className="flex items-center gap-2">
              <Badge className={TYPE_META[task.type].badge} icon={TYPE_META[task.type].icon}>
                {TYPE_META[task.type].label}
              </Badge>
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
                {task.code}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => dispatch(toggleCritical(task.id))}
                title={task.critical ? "Unmark critical" : "Mark critical"}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition",
                  task.critical
                    ? "bg-[var(--color-error-100)] text-[var(--color-error-600)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-150)]",
                )}
              >
                <Icon icon="solar:danger-triangle-bold" width={18} />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                title="Delete task"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition hover:bg-[var(--color-error-50)] hover:text-[var(--color-error-600)]"
              >
                <Icon icon="solar:trash-bin-trash-linear" width={18} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition hover:bg-[var(--color-neutral-150)]"
              >
                <Icon icon="solar:close-circle-linear" width={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            {task.critical && (
              <div className="flex items-center gap-2 rounded-xl bg-[var(--color-error-50)] px-3 py-2 text-sm font-medium text-[var(--color-error-600)]">
                <Icon icon="solar:danger-triangle-bold" width={16} />
                Marked as critical
              </div>
            )}

            <input
              value={task.title}
              onChange={(event) => dispatch(updateTask({ id: task.id, title: event.target.value }))}
              className="w-full rounded-lg border border-transparent px-1 py-1 text-xl font-bold text-[var(--color-text-primary)] outline-none transition hover:border-[var(--color-border)] focus:border-[var(--color-primary-300)]"
            />

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1.5 text-xs font-medium text-[var(--color-text-secondary)]">Status</p>
                <Select
                  size="sm"
                  value={task.status}
                  onChange={(value) =>
                    dispatch(updateTask({ id: task.id, status: value as TaskStatus }))
                  }
                  options={TASK_STATUS_ORDER.map((value) => ({
                    value,
                    label: STATUS_META[value].label,
                  }))}
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium text-[var(--color-text-secondary)]">Type</p>
                <Select
                  size="sm"
                  value={task.type}
                  onChange={(value) =>
                    dispatch(updateTask({ id: task.id, type: value as TaskType }))
                  }
                  options={TASK_TYPE_ORDER.map((value) => ({
                    value,
                    label: TYPE_META[value].label,
                  }))}
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium text-[var(--color-text-secondary)]">Assignee</p>
                <Select
                  size="sm"
                  value={task.assigneeId ?? ""}
                  onChange={handleAssign}
                  placeholder="Unassigned"
                  options={(project ? members.filter((m) => project.memberIds.includes(m.id)) : members).map(
                    (member) => ({ value: member.id, label: member.name }),
                  )}
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium text-[var(--color-text-secondary)]">Due date</p>
                <input
                  type="date"
                  value={task.dueDate ?? ""}
                  onChange={(event) =>
                    dispatch(updateTask({ id: task.id, dueDate: event.target.value || undefined }))
                  }
                  className="h-9 w-full rounded-xl border border-[var(--color-border)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ backgroundColor: `${project?.color}1a`, color: project?.color }}
              >
                <Icon icon="solar:folder-bold" width={14} />
                {project?.name}
              </span>
              {section && (
                <span className="rounded-full bg-[var(--color-neutral-150)] px-2.5 py-1 text-[var(--color-neutral-600)]">
                  {section.name}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <SectionLabel icon="solar:document-text-linear">Description</SectionLabel>
              <textarea
                value={task.description}
                onChange={(event) =>
                  dispatch(updateTask({ id: task.id, description: event.target.value }))
                }
                rows={3}
                placeholder="Add a description…"
                className="w-full resize-none rounded-xl border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
              />
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <SectionLabel icon="solar:checklist-minimalistic-linear">
                  Checklist
                  {task.checklist.length > 0 && (
                    <span className="ml-1 text-xs font-normal text-[var(--color-text-secondary)]">
                      {checklistDone}/{task.checklist.length}
                    </span>
                  )}
                </SectionLabel>
              </div>

              {task.checklist.length > 0 && (
                <Progress
                  value={task.checklist.length ? (checklistDone / task.checklist.length) * 100 : 0}
                  color="var(--color-success-500)"
                />
              )}

              <div className="space-y-1.5">
                {task.checklist.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[var(--color-neutral-100)]"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() =>
                        dispatch(toggleChecklistItem({ taskId: task.id, itemId: item.id }))
                      }
                      className="h-4 w-4 accent-[var(--color-success-500)]"
                    />
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        item.done
                          ? "text-[var(--color-text-disabled)] line-through"
                          : "text-[var(--color-text-primary)]",
                      )}
                    >
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(removeChecklistItem({ taskId: task.id, itemId: item.id }))
                      }
                      className="text-[var(--color-text-disabled)] opacity-0 transition group-hover:opacity-100 hover:text-[var(--color-error-500)]"
                    >
                      <Icon icon="solar:close-circle-linear" width={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={checklistText}
                  onChange={(event) => setChecklistText(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleAddChecklist()}
                  placeholder="Add checklist item…"
                  className="h-9 flex-1 rounded-lg border border-[var(--color-border)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
                />
                <Button variant="outlined" onClick={handleAddChecklist} className="!px-3 !py-2">
                  <Icon icon="solar:add-circle-linear" width={18} />
                </Button>
              </div>
            </div>

            {/* Attachments & links */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <SectionLabel icon="solar:paperclip-linear">Attachments & Links</SectionLabel>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-50)]"
                  >
                    + Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLinkForm((prev) => !prev)}
                    className="rounded-lg px-2 py-1 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-50)]"
                  >
                    + Link
                  </button>
                </div>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => handleUpload(event.target.files)}
              />

              {showLinkForm && (
                <div className="space-y-2 rounded-xl border border-[var(--color-border)] p-3">
                  <input
                    value={linkLabel}
                    onChange={(event) => setLinkLabel(event.target.value)}
                    placeholder="Label (e.g. Column schedule)"
                    className="h-9 w-full rounded-lg border border-[var(--color-border)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
                  />
                  <input
                    value={linkUrl}
                    onChange={(event) => setLinkUrl(event.target.value)}
                    placeholder="https://…"
                    className="h-9 w-full rounded-lg border border-[var(--color-border)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
                  />
                  <div className="flex gap-2">
                    <Select
                      size="sm"
                      value={linkKind}
                      onChange={(value) => setLinkKind(value as LinkKind)}
                      options={Object.entries(LINK_META).map(([value, meta]) => ({
                        value,
                        label: meta.label,
                      }))}
                    />
                    <Button onClick={handleAddLink} className="!px-4 !py-2">
                      Add
                    </Button>
                  </div>
                </div>
              )}

              {task.attachments.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {task.attachments.map((att) => (
                    <div key={att.id} className="group relative overflow-hidden rounded-lg border border-[var(--color-border)]">
                      <img src={att.url} alt={att.name} className="h-20 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(removeAttachment({ taskId: task.id, attachmentId: att.id }))
                        }
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-neutral-900)]/60 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <Icon icon="solar:trash-bin-minimalistic-linear" width={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {task.links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] px-3 py-2.5 transition hover:bg-[var(--color-neutral-100)]"
                >
                  <Icon icon={LINK_META[link.kind].icon} width={22} color={LINK_META[link.kind].color} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{link.label}</p>
                    <p className="truncate text-xs text-[var(--color-text-secondary)]">{link.url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      dispatch(removeLink({ taskId: task.id, linkId: link.id }));
                    }}
                    className="text-[var(--color-text-disabled)] opacity-0 transition group-hover:opacity-100 hover:text-[var(--color-error-500)]"
                  >
                    <Icon icon="solar:close-circle-linear" width={16} />
                  </button>
                </a>
              ))}

              {task.attachments.length === 0 && task.links.length === 0 && !showLinkForm && (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  No attachments yet. Add screenshots or link Google / Office docs.
                </p>
              )}
            </div>

            {/* Comments */}
            <div className="space-y-3">
              <SectionLabel icon="solar:chat-round-line-linear">
                Comments
                <span className="ml-1 text-xs font-normal text-[var(--color-text-secondary)]">
                  {task.comments.length}
                </span>
              </SectionLabel>

              <div className="space-y-3">
                {task.comments.map((c) => {
                  const author = members.find((m) => m.id === c.authorId);
                  return (
                    <div key={c.id} className="flex gap-2.5">
                      <Avatar name={author?.name ?? "?"} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {author?.name ?? "Unknown"}
                          </span>
                          <span className="text-xs text-[var(--color-text-secondary)]">
                            {relativeTime(c.createdAt)}
                          </span>
                        </div>
                        <p className="rounded-lg rounded-tl-none bg-[var(--color-neutral-100)] px-3 py-2 text-sm text-[var(--color-text-primary)]">
                          {c.text}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {task.comments.length === 0 && (
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    No comments yet — start the discussion.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Comment composer */}
          <div className="border-t border-[var(--color-border)] px-5 py-3">
            <div className="flex items-center gap-1 pb-1 text-xs text-[var(--color-text-secondary)]">
              <Icon icon="solar:clock-circle-linear" width={13} />
              Updated {relativeTime(task.updatedAt)} · Created {formatDate(task.createdAt)}
            </div>
            <div className="flex items-center gap-2.5">
              <Avatar name={members.find((m) => m.id === CURRENT_USER_ID)?.name ?? "You"} size="sm" />
              <input
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSendComment()}
                placeholder="Write a comment…"
                className="h-10 flex-1 rounded-full border border-[var(--color-border)] px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
              />
              <Button onClick={handleSendComment} disabled={!comment.trim()} className="!rounded-full !p-2.5">
                <Icon icon="solar:plain-2-bold" width={18} />
              </Button>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
};
