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
    return 'bg-[var(--color-brand-500)] text-[var(--color-on-brand)]';
  if (['F', 'G', 'T', 'I', 'J'].includes(char)) return 'bg-[var(--color-accent-teal)] text-white';
  if (['K', 'D', 'Y', 'B', 'O'].includes(char)) return 'bg-[var(--color-success)] text-white';
  if (['P', 'E', 'R', 'S', 'U'].includes(char)) return 'bg-[var(--color-accent-yellow)] text-black';
  if (['V', 'W', 'X', 'M', 'Z'].includes(char)) return 'bg-[var(--color-error)] text-white';

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
          return 'bg-[var(--color-brand-500)] text-[var(--color-on-brand)]';
        case 'brand-light':
          return 'bg-[var(--color-brand-100)] text-[var(--color-on-brand)]';
        case 'secondary':
        case 'info':
          return 'bg-[var(--color-accent-teal)] text-white';
        case 'success':
          return 'bg-[var(--color-success)] text-white';
        case 'warning':
          return 'bg-[var(--color-accent-yellow)] text-black';
        case 'error':
          return 'bg-[var(--color-error)] text-white';
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
            className={`absolute bottom-0 right-0 block w-2 h-2 rounded-full border-2 border-white ${
              BadgeProps.color || 'bg-[var(--color-success)]'
            }`}
          />
        )}
      </div>
    );
  },
);

export { CustomAvatar };
