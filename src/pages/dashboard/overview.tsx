import { SummaryCard } from "@app/components/ui/cards";
import { Icon } from "@iconify/react";

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
    </div>
  );
};

export { Overview };
