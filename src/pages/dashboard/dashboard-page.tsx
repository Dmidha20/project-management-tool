import { useState } from "react";

import { Button } from "@app/components/ui";

import { Overview } from "./overview";
import { Projects } from "./projects";
import { Tasks } from "./tasks";
import { Members } from "./members";
import { Analytics } from "./analytics";
import { Reports } from "./reports";

const DashboardPage = () => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects" },
    { id: "tasks", label: "Tasks" },
    { id: "members", label: "Members" },
    { id: "analytics", label: "Analytics" },
    { id: "reports", label: "Reports" },
  ];

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProject, setSelectedProject] = useState("All Projects");

  const renderContent = () => {
    switch (activeTab) {
      case "projects":
        return <Projects />;

      case "tasks":
        return <Tasks />;

      case "members":
        return <Members />;

      case "analytics":
        return <Analytics />;

      case "reports":
        return <Reports />;

      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-[var(--color-background)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Welcome Back 👋
          </h1>

          <p className="mt-1 text-[var(--color-text-secondary)]">
            Monitor your projects, tasks and team performance.
          </p>
        </div>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 shadow-sm"
        >
          <option>All Projects</option>
          <option>Project Alpha</option>
          <option>Project Beta</option>
          <option>Project Gamma</option>
        </select>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "primary" : "outlined"}
            onClick={() => setActiveTab(tab.id)}
            className="min-w-[130px] h-11"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export { DashboardPage };