import { Icon } from '@iconify/react';

interface IconifyProps {
  icon: string;
  size?: number | string;
  className?: string;
  onClick?: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  style?: React.CSSProperties;
}

export function Iconify({ icon, size = 20, className = '', onClick, style }: IconifyProps) {
  return (
    <Icon
      icon={icon}
      width={size}
      height={size}
      className={`inline-block ${className}`}
      onClick={onClick}
      style={style}
    />
  );
}
