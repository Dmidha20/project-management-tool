import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import type { Project, Section } from "@app/data/types";
import { Button, Field, TextInput, useToast } from "@app/components/ui";
import { DialogLayout } from "@app/components/layouts/popup/dialog-layout";
import { useAppDispatch } from "@app/store";
import { removeSection, renameSection } from "@app/store/slices/projects-slice";

interface EditSectionDialogProps {
  project: Project | null;
  section: Section | null;
  onClose: () => void;
}

export const EditSectionDialog = ({ project, section, onClose }: EditSectionDialogProps) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [name, setName] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setName(section?.name ?? "");
    setConfirmingDelete(false);
  }, [section]);

  const handleClose = () => {
    setConfirmingDelete(false);
    onClose();
  };

  const handleSave = () => {
    if (!project || !section || !name.trim()) return;
    dispatch(renameSection({ projectId: project.id, sectionId: section.id, name: name.trim() }));
    toast(`Section renamed to “${name.trim()}”`);
    handleClose();
  };

  const handleDelete = () => {
    if (!project || !section) return;
    dispatch(removeSection({ projectId: project.id, sectionId: section.id }));
    toast(`Section “${section.name}” removed`, "info");
    handleClose();
  };

  return (
    <DialogLayout
      open={Boolean(project && section)}
      onClose={handleClose}
      title="Edit Section"
      description={project ? `Under ${project.name}` : undefined}
      dialogClass="!w-[420px]"
      footer={
        confirmingDelete ? (
          <>
            <Button variant="outlined" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="!bg-[var(--color-error-600)] hover:!bg-[var(--color-error-700)]"
            >
              Confirm Remove
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={() => setConfirmingDelete(true)}
              icon={<Icon icon="solar:trash-bin-trash-linear" width={16} />}
            >
              Remove
            </Button>
            <Button onClick={handleSave} disabled={!name.trim()}>
              Save
            </Button>
          </>
        )
      }
    >
      {confirmingDelete ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          Remove <span className="font-medium text-[var(--color-text-primary)]">{section?.name}</span>{" "}
          from this project? Tasks already assigned to it will keep their history but no longer show a
          section tag.
        </p>
      ) : (
        <Field label="Section Name" required>
          <TextInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
            onKeyDown={(event) => event.key === "Enter" && handleSave()}
          />
        </Field>
      )}
    </DialogLayout>
  );
};
