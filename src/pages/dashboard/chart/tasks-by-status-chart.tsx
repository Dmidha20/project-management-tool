import ApexCharts, { type ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export type TaskStatus =
  | "Completed"
  | "In Progress"
  | "Review"
  | "Blocked"
  | "Todo";

export type TaskStatusItem = {
  status: TaskStatus;
  count: number;
  color: string;
};

type TasksByStatusChartProps = {
  data?: TaskStatusItem[];
  period?: "This Week" | "This Month" | "This Quarter";
  onPeriodChange?: (
    period: "This Week" | "This Month" | "This Quarter",
  ) => void;
};

const TASK_STATUS_CHART_ID = "tasks-by-status";

const TASK_STATUS_DATA: TaskStatusItem[] = [
  {
    status: "Completed",
    count: 154,
    color: "var(--color-success-500)",
  },
  {
    status: "In Progress",
    count: 67,
    color: "var(--color-primary)",
  },
  {
    status: "Review",
    count: 29,
    color: "var(--color-warning-500)",
  },
  {
    status: "Blocked",
    count: 11,
    color: "var(--color-error-500)",
  },
  {
    status: "Todo",
    count: 43,
    color: "var(--color-neutral-400)",
  },
];

const PERIODS = ["This Week", "This Month", "This Quarter"] as const;

const TasksByStatusChart = ({
  data = TASK_STATUS_DATA,
  period = "This Month",
  onPeriodChange,
}: TasksByStatusChartProps) => {
  const totalTasks = data.reduce((sum, item) => sum + item.count, 0);

  const getPercentage = (count: number) =>
    Math.round((count / totalTasks) * 100);

  const options: ApexOptions = {
    chart: {
      id: TASK_STATUS_CHART_ID,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        speed: 500,
      },
    },

    colors: data.map((item) => item.color),

    labels: data.map((item) => item.status),

    legend: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },

    stroke: {
      width: 3,
      colors: ["var(--color-surface)"],
    },

    tooltip: {
      y: {
        formatter: (value) => `${value} Tasks (${getPercentage(value)}%)`,
      },
    },

    plotOptions: {
      pie: {
        donut: {
          size: "62%",

          labels: {
            show: true,

            name: {
              show: true,
              color: "var(--color-text-secondary)",
              fontSize: "12px",
            },

            value: {
              show: true,
              color: "var(--color-text-primary)",
              fontSize: "22px",
              fontWeight: 700,

              formatter: () => String(totalTasks),
            },

            total: {
              show: true,
              label: "Total Tasks",

              color: "var(--color-text-secondary)",

              formatter: () => String(totalTasks),
            },
          },
        },
      },
    },
  };

  const highlightStatus = (status: TaskStatus) => {
    void ApexCharts.exec(TASK_STATUS_CHART_ID, "highlightSeries", status);
  };

  const resetHighlight = () => {
    void ApexCharts.exec(TASK_STATUS_CHART_ID, "resetSeries");
  };

  return (
    <section className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Tasks by Status
          </h2>

          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Current task distribution
          </p>
        </div>

        <select
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value as typeof period)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)]"
        >
          {PERIODS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      {/* Donut */}

      <div className="mt-5 flex justify-center">
        <Chart
          options={options}
          series={data.map((item) => item.count)}
          type="donut"
          height={200}
          width={200}
        />
      </div>

      {/* Legend */}

      <div className="mt-5 space-y-3 flex-1">
        {data.map((item) => {
          const percentage = getPercentage(item.count);

          return (
            <button
              key={item.status}
              type="button"
              onMouseEnter={() => highlightStatus(item.status)}
              onMouseLeave={resetHighlight}
              onFocus={() => highlightStatus(item.status)}
              onBlur={resetHighlight}
              className="w-full rounded-lg transition hover:bg-[var(--color-surface-hover)] p-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    background: item.color,
                  }}
                />

                <span className="flex-1 text-left text-sm font-medium text-[var(--color-text-primary)]">
                  {item.status}
                </span>

                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {item.count}
                </span>

                <span className="w-10 text-right text-sm text-[var(--color-text-secondary)]">
                  {percentage}%
                </span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-[var(--color-border)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    background: item.color,
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export { TasksByStatusChart };
