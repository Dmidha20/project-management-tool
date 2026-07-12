import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';

import { type NavItemProps } from '../types';

export default function NavItem({
  item,
  depth,
  open,
  active,
  isExternalLink,
  mini = false,
  ...other
}: NavItemProps) {
  const { title, path, icon, info, children, disabled, caption } = item;

  const renderContent = (
    <div
      {...other}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer
        transition-colors duration-200
        ${active ? 'bg-brand-500 text-white' : 'text-gray-700 hover:bg-gray-100'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${mini ? 'justify-center px-2' : `px-3 py-2`}
      `}
      style={{ paddingLeft: mini ? undefined : `${depth * 12}px` }}
      title={mini ? title : undefined}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {!mini && (
        <div className="flex-1 min-w-0">
          <p className={`truncate text-sm ${active ? 'font-semibold' : 'font-medium'}`}>{title}</p>
          {caption && <span className="block text-xs text-gray-500">{caption}</span>}
        </div>
      )}

      {!mini && info && <span className="ml-2 text-xs text-gray-500">{info}</span>}

      {!mini && !!children && (
        <Icon
          icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          className="ml-1 w-4 h-4 text-gray-500"
        />
      )}
    </div>
  );

  if (isExternalLink) {
    return disabled ? (
      <div>{renderContent}</div>
    ) : (
      <a href={path} target="_blank" rel="noopener noreferrer" className="block no-underline">
        {renderContent}
      </a>
    );
  }
  if (children) {
    return renderContent;
  }

  return disabled ? (
    <div>{renderContent}</div>
  ) : (
    <RouterLink to={path} className="block no-underline">
      {renderContent}
    </RouterLink>
  );
}
