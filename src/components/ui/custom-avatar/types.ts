import type { HTMLAttributes, ReactNode } from 'react';

// ----------------------------------------------------------------------

export interface CustomAvatarProps extends HTMLAttributes<HTMLDivElement> {
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'brand-light';
  name?: string;
  BadgeProps?: {
    color?: string;
    className?: string;
  };

  children?: ReactNode;
}
