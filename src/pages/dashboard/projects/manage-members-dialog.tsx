import { useEffect, useState } from "react";

import type { Project } from "@app/data/types";
import { Button, useToast } from "@app/components/ui";
import { DialogLayout } from "@app/components/layouts/popup/dialog-layout";
import { useAppDispatch, useAppSelector } from "@app/store";
import { setProjectMembers } from "@app/store/slices/projects-slice";
import { MemberPicker } from "../components/member-picker";

interface ManageMembersDialogProps {
  project: Project | null;
  onClose: () => void;
}

export const ManageMembersDialog = ({ project, onClose }: ManageMembersDialogProps) => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const members = useAppSelector((state) => state.members);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (project) setSelected(project.memberIds);
  }, [project]);

  const handleSave = () => {
    if (!project) return;
    dispatch(setProjectMembers({ projectId: project.id, memberIds: selected }));
    toast(`Team updated for ${project.name}`);
    onClose();
  };

  return (
    <DialogLayout
      open={Boolean(project)}
      onClose={onClose}
      title={project ? `Assign members · ${project.name}` : "Assign members"}
      description="Choose who works on this project"
      dialogClass="!w-[480px]"
      footer={
        <>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Team</Button>
        </>
      }
    >
      <MemberPicker members={members} selected={selected} onChange={setSelected} />
    </DialogLayout>
  );
};
