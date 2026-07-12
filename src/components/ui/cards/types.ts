import type { ReactNode } from "react";

export interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  trend?: "up" | "down";
}