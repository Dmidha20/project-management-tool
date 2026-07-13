interface Props {
  height?: string;
  color?: string;
  trackColor?: string;
  className?: string;
}

export function ProgressBar({
  height = "h-1",
  color = "bg-blue-500",
  trackColor = "bg-gray-200",
  className = "",
}: Props) {
  return (
    <div
      className={`relative w-full overflow-hidden ${trackColor} ${height} ${className}`}
    >
      <div className={`absolute inset-y-0 left-0 ${color}`} />
    </div>
  );
}
