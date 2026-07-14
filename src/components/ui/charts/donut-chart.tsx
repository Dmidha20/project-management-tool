import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutDatum[];
  height?: number;
  centerLabel?: string;
}

export const DonutChart = ({ data, height = 240, centerLabel = "Total" }: DonutChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const options: ApexOptions = {
    chart: { fontFamily: "inherit", toolbar: { show: false } },
    labels: data.map((item) => item.label),
    colors: data.map((item) => item.color),
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 3, colors: ["var(--color-surface)"] },
    tooltip: { y: { formatter: (value) => `${value} tasks` } },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            name: { show: true, color: "var(--color-text-secondary)", fontSize: "12px" },
            value: {
              show: true,
              color: "var(--color-text-primary)",
              fontSize: "24px",
              fontWeight: 700,
              formatter: () => String(total),
            },
            total: {
              show: true,
              label: centerLabel,
              color: "var(--color-text-secondary)",
              formatter: () => String(total),
            },
          },
        },
      },
    },
  };

  return (
    <Chart
      options={options}
      series={data.map((item) => item.value)}
      type="donut"
      height={height}
    />
  );
};
