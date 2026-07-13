import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

export type ProjectProgressItem = {
  name: string;
  progress: number;
};

export type ProjectProgressSummary = {
  totalProjects: number;
  completedProjects: number;
  averageProgress: number;
};

type ProjectProgressChartProps = {
  data?: ProjectProgressItem[];
  summary?: ProjectProgressSummary;
};

const DEFAULT_PROJECTS: ProjectProgressItem[] = [
  { name: "Website", progress: 95 },
  { name: "Mobile", progress: 72 },
  { name: "CRM", progress: 54 },
  { name: "HR", progress: 81 },
  { name: "Marketing", progress: 38 },
];

const DEFAULT_SUMMARY: ProjectProgressSummary = {
  totalProjects: 24,
  completedProjects: 16,
  averageProgress: 68,
};

const ProjectProgressChart = ({
  data = DEFAULT_PROJECTS,
  summary = DEFAULT_SUMMARY,
}: ProjectProgressChartProps) => {
  const summaryItems = [
    {
      label: "Projects",
      value: summary.totalProjects,
    },
    {
      label: "Completed",
      value: summary.completedProjects,
    },
    {
      label: "Avg Progress",
      value: `${summary.averageProgress}%`,
    },
  ];

  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        speed: 500,
      },
    },

    colors: ["var(--color-primary)"],

    dataLabels: {
      enabled: false,
    },

    grid: {
      borderColor: "var(--color-divider)",
      strokeDashArray: 4,
      padding: {
        left: 0,
        right: 8,
      },
    },

    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "34%",
      },
    },

    tooltip: {
      y: {
        formatter: (value) => `${value}% Completed`,
      },
    },

    xaxis: {
      categories: data.map((item) => item.name),

      labels: {
        trim: true,

        style: {
          colors: "var(--color-text-secondary)",
          fontSize: "11px",
        },
      },

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4,

      labels: {
        formatter: (value) => `${value}%`,

        style: {
          colors: "var(--color-text-secondary)",
          fontSize: "11px",
        },
      },
    },
  };

  return (
    <section className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Project Progress
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Overall completion across active projects
          </p>
        </div>

        {/* Summary */}

        <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-[var(--color-border)]">
          {summaryItems.map((item) => (
            <div
              key={item.label}
              className="border-r border-[var(--color-border)] px-4 py-2 last:border-r-0 text-center"
            >
              <p className="text-xs text-[var(--color-text-secondary)]">
                {item.label}
              </p>

              <p className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}

      <div className="mt-5 flex-1 min-h-[220px]">
        <Chart
          options={options}
          series={[
            {
              name: "Progress",
              data: data.map((item) => item.progress),
            },
          ]}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </section>
  );
};

export { ProjectProgressChart };
