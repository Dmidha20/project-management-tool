import React from 'react';

import { Button, type ButtonProps } from '../button';
import { Iconify } from '../iconify';

export interface HeaderAction extends ButtonProps {
  label: string;
  icon?: string;
  visible?: boolean;
}

interface HeaderActionsProps {
  actions?: HeaderAction[] | undefined;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ actions = [] }) => {
  if (!actions.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions
        .filter((action) => action.visible !== false)
        .map(({ label, icon, visible: _, ...buttonProps }, index) => {
          return (
            <Button key={index} className="!px-4 !py-2 min-w-[100px]" {...buttonProps}>
              {icon && <Iconify icon={icon} className="mr-1" />}
              {label}
            </Button>
          );
        })}
    </div>
  );
};
