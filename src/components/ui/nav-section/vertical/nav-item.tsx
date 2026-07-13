import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';

import { type NavItemProps } from '../types';

export default function NavItem({ item, depth, open, active, isExternalLink, mini = false, ...other }: NavItemProps) {
  const { title, path, icon, info, children, disabled, caption } = item;

  const renderContent = (
    <div
      {...other}
      className={`group flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-700)] font-semibold text-[var(--color-on-primary)] shadow-lg shadow-[var(--color-primary-900)]/25'
          : 'text-[var(--color-text-disabled)] hover:bg-[var(--color-text-white)]/5 hover:text-[var(--color-neutral-100)]'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${mini ? 'justify-center px-2' : ''}`}
      style={{ paddingLeft: mini ? undefined : `${depth * 12}px` }}
      title={mini ? title : undefined}
    >
      {icon && <span className={`flex shrink-0 ${active ? 'text-[var(--color-on-primary)]' : 'text-[var(--color-text-disabled)] group-hover:text-[var(--color-primary-300)]'}`}>{icon}</span>}
      {!mini && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px]">{title}</p>
          {caption && <span className="block text-xs text-[var(--color-text-secondary)]">{caption}</span>}
        </div>
      )}
      {!mini && info && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary-700)] px-1 text-[10px] font-semibold text-[var(--color-primary-100)]">{info}</span>}
      {!mini && !!children && <Icon icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} className="h-4 w-4 text-[var(--color-text-secondary)]" />}
    </div>
  );

  if (isExternalLink) return disabled ? <div>{renderContent}</div> : <a href={path} target="_blank" rel="noopener noreferrer" className="block no-underline">{renderContent}</a>;
  if (children) return renderContent;
  return disabled ? <div>{renderContent}</div> : <RouterLink to={path} className="block no-underline">{renderContent}</RouterLink>;
}
