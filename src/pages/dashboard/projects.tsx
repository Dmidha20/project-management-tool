import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

import type { Project } from "@app/data/types";
import { Button, EmptyState } from "@app/components/ui";
import { useAppSelector } from "@app/store";
import { ProjectCard } from "./projects/project-card";
import { CreateProjectDialog } from "./projects/create-project-dialog";
import { ManageMembersDialog } from "./projects/manage-members-dialog";

const Projects = () => {
  const navigate = useNavigate();
  const projects = useAppSelector((state) => state.projects);
  const tasks = useAppSelector((state) => state.tasks);
  const members = useAppSelector((state) => state.members);

  const [showCreate, setShowCreate] = useState(false);
  const [managing, setManaging] = useState<Project | null>(null);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Projects</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {projects.length} projects · manage teams, sections and progress
          </p>
        </div>
        <Button
          icon={<Icon icon="solar:add-circle-bold" width={18} />}
          onClick={() => setShowCreate(true)}
        >
          New Project
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={tasks}
              members={members}
              onOpen={() => navigate(`/dashboard/board?project=${project.id}`)}
              onManageMembers={() => setManaging(project)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="solar:folder-open-linear"
          title="No projects yet"
          description="Create your first project to start organising tasks."
          action={
            <Button onClick={() => setShowCreate(true)} icon={<Icon icon="solar:add-circle-linear" width={18} />}>
              New Project
            </Button>
          }
        />
      )}

      <CreateProjectDialog open={showCreate} onClose={() => setShowCreate(false)} />
      <ManageMembersDialog project={managing} onClose={() => setManaging(null)} />
    </div>
  );
};

export { Projects };
export default Projects;
