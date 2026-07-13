import { Icon } from "@iconify/react";

import { SummaryCard } from "@app/components/ui/cards";

import { ProjectProgressChart } from "./chart/project-progress-chart";
import { TasksByStatusChart } from "./chart/tasks-by-status-chart";

const Overview = () => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Active Projects"
          value={12}
          change="+8%"
          trend="up"
          icon={<Icon icon="solar:folder-with-files-bold-duotone" width={28} />}
        />

        <SummaryCard
          title="Pending Tasks"
          value={156}
          change="+12%"
          trend="up"
          icon={<Icon icon="solar:checklist-bold-duotone" width={28} />}
        />

        <SummaryCard
          title="Team Members"
          value={18}
          change="+2"
          trend="up"
          icon={
            <Icon icon="solar:users-group-rounded-bold-duotone" width={28} />
          }
        />

        <SummaryCard
          title="Completed Tasks"
          value={324}
          change="-4%"
          trend="down"
          icon={<Icon icon="solar:verified-check-bold-duotone" width={28} />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-stretch">
        {/* Project Progress */}
        <div className="xl:col-span-7 flex flex-col">
          <ProjectProgressChart />
        </div>

        {/* Task Status */}
        <div className="xl:col-span-5 flex flex-col">
          <TasksByStatusChart />
        </div>
      </div>
    </div>
  );
};

export { Overview };
