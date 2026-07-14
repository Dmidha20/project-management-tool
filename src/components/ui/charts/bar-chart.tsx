import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface BarChartProps {
  categories: string[];
  data: number[];
  color?: string;
  colors?: string[];
  horizontal?: boolean;
  height?: number;
  max?: number;
  valueSuffix?: string;
  seriesName?: string;
}

export const BarChart = ({
  categories,
  data,
  color = "var(--color-primary)",
  colors,
  horizontal = false,
  height = 260,
  max,
  valueSuffix = "",
  seriesName = "Value",
}: BarChartProps) => {
  const options: ApexOptions = {
    chart: { fontFamily: "inherit", toolbar: { show: false } },
    colors: colors ?? [color],
    dataLabels: { enabled: false },
    grid: { borderColor: "var(--color-divider)", strokeDashArray: 4, padding: { left: 0, right: 8 } },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal,
        columnWidth: "48%",
        barHeight: "62%",
        distributed: Boolean(colors),
      },
    },
    legend: { show: false },
    tooltip: { y: { formatter: (value) => `${value}${valueSuffix}` } },
    xaxis: {
      categories,
      labels: { trim: true, style: { colors: "var(--color-text-secondary)", fontSize: "11px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      max,
      labels: {
        formatter: (value) => `${Math.round(value)}${horizontal ? "" : valueSuffix}`,
        style: { colors: "var(--color-text-secondary)", fontSize: "11px" },
      },
    },
  };

  return (
    <Chart
      options={options}
      series={[{ name: seriesName, data }]}
      type="bar"
      height={height}
      width="100%"
    />
  );
};
