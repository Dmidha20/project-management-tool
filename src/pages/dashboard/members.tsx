import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import { ROLE_META } from "@app/data/types";
import { Avatar, Badge, Button, Progress } from "@app/components/ui";
import { useAppSelector } from "@app/store";
import { memberStats } from "@app/data/derive";
import { CreateMemberDialog } from "./members/create-member-dialog";

const Members = () => {
  const navigate = useNavigate();
  const members = useAppSelector((state) => state.members);
  const tasks = useAppSelector((state) => state.tasks);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Members</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {members.length} people · track workload and performance
          </p>
        </div>
        <Button
          icon={<Icon icon="solar:user-plus-bold" width={18} />}
          onClick={() => setShowCreate(true)}
        >
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => {
          const stats = memberStats(tasks, member.id);
          const role = ROLE_META[member.role];

          return (
            <div
              key={member.id}
              className="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-xs)] transition-all hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-center gap-3.5">
                <Avatar name={member.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-[var(--color-text-primary)]">
                    {member.name}
                  </h3>
                  <p className="truncate text-sm text-[var(--color-text-secondary)]">{member.title}</p>
                </div>
                <Badge className={role.badge} icon={role.icon}>
                  {member.role}
                </Badge>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                <Icon icon="solar:letter-linear" width={15} />
                <span className="truncate">{member.email}</span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[var(--color-neutral-100)] p-3 text-center">
                <div>
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">{stats.active}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Active</p>
                </div>
                <div className="border-x border-[var(--color-border)]">
                  <p className="text-lg font-bold text-[var(--color-text-primary)]">{stats.completed}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Done</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-[var(--color-error-600)]">{stats.critical}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Critical</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-[var(--color-text-secondary)]">Completion rate</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">{stats.percent}%</span>
                </div>
                <Progress value={stats.percent} color="var(--color-success-500)" />
              </div>

              <Button
                variant="outlined"
                onClick={() => navigate(`/dashboard/board?assignee=${member.id}`)}
                className="mt-4 !py-2 text-sm"
              >
                View tasks
              </Button>
            </div>
          );
        })}
      </div>

      <CreateMemberDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
};

export { Members };
export default Members;
