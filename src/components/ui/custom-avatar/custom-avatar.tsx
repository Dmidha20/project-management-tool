import { forwardRef } from 'react';

import type { CustomAvatarProps } from './types';
import { SvgColor } from '../svg-color';

const getCharAtName = (name: string) => {
  if (!name) return '';
  const namePart = name.trim().split(' ');

  return ((namePart[0]?.[0] ?? '') + (namePart[1]?.[0] ?? '')).toUpperCase();
};

const getColorClassByName = (name: string) => {
  const char = getCharAtName(name);
  if (['A', 'N', 'H', 'L', 'Q'].includes(char))
    return 'bg-[var(--color-primary-500)] text-[var(--color-on-primary)]';
  if (['F', 'G', 'T', 'I', 'J'].includes(char)) return 'bg-[var(--color-info-500)] text-[var(--color-on-primary)]';
  if (['K', 'D', 'Y', 'B', 'O'].includes(char)) return 'bg-[var(--color-success-500)] text-[var(--color-on-primary)]';
  if (['P', 'E', 'R', 'S', 'U'].includes(char)) return 'bg-[var(--color-warning-400)] text-[var(--color-text-primary)]';
  if (['V', 'W', 'X', 'M', 'Z'].includes(char)) return 'bg-[var(--color-error-500)] text-[var(--color-on-primary)]';

  return 'bg-[var(--color-neutral-300)] text-[var(--color-neutral-800)]';
};

interface CustomAvatarWithSrcProps extends CustomAvatarProps {
  src?: string | undefined;
  icon?: string;
  imgClassName?: string;
}

const CustomAvatar = forwardRef<HTMLDivElement, CustomAvatarWithSrcProps>(
  (
    {
      color,
      name = '',
      src,
      icon,
      BadgeProps,
      children,
      className = '',
      imgClassName = 'h-full w-full object-contain',
      ...other
    },
    ref,
  ) => {
    const charAtName = getCharAtName(name);

    const colorClass = (() => {
      switch (color) {
        case 'primary':
          return 'bg-[var(--color-primary-500)] text-[var(--color-on-primary)]';
        case 'brand-light':
          return 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]';
        case 'secondary':
        case 'info':
          return 'bg-[var(--color-info-500)] text-[var(--color-on-primary)]';
        case 'success':
          return 'bg-[var(--color-success-500)] text-[var(--color-on-primary)]';
        case 'warning':
          return 'bg-[var(--color-warning-400)] text-[var(--color-text-primary)]';
        case 'error':
          return 'bg-[var(--color-error-500)] text-[var(--color-on-primary)]';
        case 'default':
        default:
          return getColorClassByName(name);
      }
    })();

    return (
      <div
        ref={ref}
        className={`relative flex items-center justify-center rounded-full font-medium overflow-hidden ${colorClass} ${className}`}
        {...other}
      >
        {src ? (
          <img src={src} alt={name} className={imgClassName} />
        ) : icon ? (
          <SvgColor src={icon} className={imgClassName} />
        ) : (
          name && charAtName
        )}

        {children}

        {BadgeProps && (
          <span
            className={`absolute bottom-0 right-0 block w-2 h-2 rounded-full border-2 border-[var(--color-surface)] ${
              BadgeProps.color || 'bg-[var(--color-success-500)]'
            }`}
          />
        )}
      </div>
    );
  },
);

export { CustomAvatar };
