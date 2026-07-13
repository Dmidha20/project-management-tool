import { useState } from "react";

import { ProjectList } from "./project-list";
import { useTable } from "@app/components/ui/table";
import { AddProject } from "./add-project";
import { Header } from "@app/components/ui/header";
import type { IProject } from "./types";
import { MOCK_PROJECTS } from "./mock-data";

const ProjectListPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [projects, setProjects] = useState<IProject[]>(MOCK_PROJECTS);

  const [openAddProject, setOpenAddProject] = useState(false);
  const tableProps = useTable<IProject>();
  const loading = false;
  const totalCount = projects.length;
  const renderSelectionActions = () => <></>;

  return (
    <>
      <div className="flex h-full flex-col gap-6 p-6">
        <Header
          title="Projects"
          actions={[
            {
              label: "Add Project",
              onClick: () => setOpenAddProject(true),
            },
          ]}
        />

        {/* Toolbar */}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-72 rounded-xl border border-[var(--color-border)] px-4 outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 rounded-xl border border-[var(--color-border)] px-4"
            >
              <option value="">All Status</option>
              <option>Planning</option>
              <option>In Progress</option>
              <option>Review</option>
              <option>Completed</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="h-11 rounded-xl border border-[var(--color-border)] px-4"
            >
              <option value="">All Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

        </div>

        {/* Table */}

        <div className="flex-1 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <ProjectList
            tableProps={tableProps}
            rows={projects}
            loading={loading}
            totalCount={totalCount}
            renderSelectionActions={renderSelectionActions}
          />
        </div>
      </div>

      {openAddProject && (
        <AddProject
          open={openAddProject}
          onClose={() => setOpenAddProject(false)}
          onCreate={(project) => setProjects((prev) => [project, ...prev])}
        />
      )}
    </>
  );
};

export { ProjectListPage };
