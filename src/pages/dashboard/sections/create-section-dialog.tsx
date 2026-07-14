import { useState } from "react";

import type { Project } from "@app/data/types";
import { Button, Field, TextInput, useToast } from "@app/components/ui";
import { DialogLayout } from "@app/components/layouts/popup/dialog-layout";
import { useAppDispatch } from "@app/store";
import { addSection } from "@app/store/slices/projects-slice";
import { uid } from "@app/lib";

interface CreateSectionDialogProps {
  open: boolean;
  project: Project | null;
  onClose: () => void;
}

export const CreateSectionDialog = ({ open, project, onClose }: CreateSectionDialogProps) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [name, setName] = useState("");

  const handleClose = () => {
    setName("");
    onClose();
  };

  const handleCreate = () => {
    if (!project || !name.trim()) return;

    dispatch(
      addSection({
        projectId: project.id,
        section: { id: uid("sec"), name: name.trim() },
      }),
    );
    toast(`Section “${name.trim()}” added`);
    handleClose();
  };

  return (
    <DialogLayout
      open={open}
      onClose={handleClose}
      title="Add Section"
      description={project ? `New section under ${project.name}` : undefined}
      dialogClass="!w-[420px]"
      footer={
        <>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Add Section
          </Button>
        </>
      }
    >
      <Field label="Section Name" required>
        <TextInput
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Structural"
          autoFocus
          onKeyDown={(event) => event.key === "Enter" && handleCreate()}
        />
      </Field>
    </DialogLayout>
  );
};
