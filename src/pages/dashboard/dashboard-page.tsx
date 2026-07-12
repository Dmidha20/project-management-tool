import { useState } from "react";




import { Button } from "@app/components/ui";
import { Projects } from "./projects";
import { Tasks } from "./tasks";
import { Members } from "./members";
import { Analytics } from "./analytics";
import { Reports } from "./reports";
import { Overview } from "./overview";

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

      case "overview":
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-slate-50">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome Back 👋
          </h1>

          <p className="mt-1 text-slate-500">
            Monitor your projects, tasks and team performance.
          </p>
        </div>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option>All Projects</option>
          <option>Project Alpha</option>
          <option>Project Beta</option>
          <option>Project Gamma</option>
        </select>

      </div>

      {/* Tabs */}

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

      {/* Content */}

      <div className="flex-1">
        {renderContent()}
      </div>

    </div>
  );
};

export { DashboardPage };