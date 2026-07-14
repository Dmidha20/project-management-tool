import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";

import type { Section } from "@app/data/types";
import { Button, EmptyState, Select } from "@app/components/ui";
import { useAppSelector } from "@app/store";
import { SectionCard } from "./sections/section-card";
import { CreateSectionDialog } from "./sections/create-section-dialog";
import { EditSectionDialog } from "./sections/edit-section-dialog";

const Sections = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const projects = useAppSelector((state) => state.projects);
  const tasks = useAppSelector((state) => state.tasks);

  const [projectId, setProjectId] = useState(
    () => searchParams.get("project") ?? projects[0]?.id ?? "",
  );
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);

  useEffect(() => {
    const fromQuery = searchParams.get("project");
    if (fromQuery) {
      setProjectId(fromQuery);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const project = useMemo(
    () => projects.find((item) => item.id === projectId) ?? null,
    [projects, projectId],
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Sections</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {project
              ? `${project.sections.length} sections in ${project.name}`
              : "Organise each project into sections to group tasks"}
          </p>
        </div>

        {projects.length > 0 && (
          <div className="flex items-center gap-2.5">
            <Select
              className="w-56"
              value={projectId}
              onChange={setProjectId}
              options={projects.map((item) => ({ value: item.id, label: item.name }))}
            />
            <Button
              icon={<Icon icon="solar:add-circle-bold" width={18} />}
              onClick={() => setShowCreate(true)}
              disabled={!project}
            >
              New Section
            </Button>
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon="solar:folder-open-linear"
          title="No projects yet"
          description="Create a project first, then break it down into sections."
          action={
            <Button onClick={() => navigate("/dashboard/projects")}>Go to Projects</Button>
          }
        />
      ) : project && project.sections.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {project.sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              tasks={tasks}
              color={project.color}
              onOpen={() =>
                navigate(`/dashboard/board?project=${project.id}&section=${section.id}`)
              }
              onEdit={() => setEditing(section)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="solar:layers-minimalistic-linear"
          title="No sections yet"
          description={project ? `Add the first section to ${project.name}.` : undefined}
          action={
            <Button
              onClick={() => setShowCreate(true)}
              icon={<Icon icon="solar:add-circle-linear" width={18} />}
              disabled={!project}
            >
              New Section
            </Button>
          }
        />
      )}

      <CreateSectionDialog open={showCreate} project={project} onClose={() => setShowCreate(false)} />
      <EditSectionDialog project={project} section={editing} onClose={() => setEditing(null)} />
    </div>
  );
};

export { Sections };
export default Sections;
