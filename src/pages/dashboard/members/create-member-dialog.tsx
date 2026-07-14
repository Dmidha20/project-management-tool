import { useState } from "react";

import type { Member, Role } from "@app/data/types";
import { Button, Field, Select, TextInput, useToast } from "@app/components/ui";
import { DialogLayout } from "@app/components/layouts/popup/dialog-layout";
import { useAppDispatch } from "@app/store";
import { addMember } from "@app/store/slices/members-slice";
import { uid } from "@app/lib";

const ROLE_OPTIONS: Role[] = ["Admin", "Manager", "Member"];

interface CreateMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateMemberDialog = ({ open, onClose }: CreateMemberDialogProps) => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState<Role>("Member");

  const reset = () => {
    setName("");
    setEmail("");
    setTitle("");
    setRole("Member");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCreate = () => {
    if (!name.trim()) return;
    const member: Member = {
      id: uid("mem"),
      name: name.trim(),
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, ".")}@studio.com`,
      title: title.trim() || "Team Member",
      role,
    };
    dispatch(addMember(member));
    toast(`${member.name} added to the team`);
    handleClose();
  };

  return (
    <DialogLayout
      open={open}
      onClose={handleClose}
      title="Add Member"
      description="Invite a new person to your workspace"
      dialogClass="!w-[480px]"
      footer={
        <>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Add Member
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Full Name" required>
          <TextInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Jordan Rivera"
            autoFocus
          />
        </Field>

        <Field label="Email">
          <TextInput
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="jordan@studio.com"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Job Title">
            <TextInput
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="BIM Modeler"
            />
          </Field>

          <Field label="Role">
            <Select
              value={role}
              onChange={(value) => setRole(value as Role)}
              options={ROLE_OPTIONS.map((value) => ({ value, label: value }))}
            />
          </Field>
        </div>
      </div>
    </DialogLayout>
  );
};
