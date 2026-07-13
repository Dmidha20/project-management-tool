import clsx from 'clsx';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Iconify } from '../iconify';
import { HeaderActions } from './header-action';
import type { HeaderProps } from './types';
import { Button } from '../button';

type RowSpaceProps = React.HTMLAttributes<HTMLDivElement>;

export const RowSpace: React.FC<RowSpaceProps> = ({ children, className = '', ...rest }) => (
  <div className={clsx('flex items-center', className)} {...rest}>
    {children}
  </div>
);

export const Header = ({
  title,
  shownBackButton,
  actions,
  rightSection,
  leftSection,
  hidden = false,
}: HeaderProps) => {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  return (
    <RowSpace className={'justify-between flex flex-wrap page-header-spacing'} hidden={hidden}>
      <RowSpace className="">
        {shownBackButton && (
          <Button
            variant="clear"
            aria-label="Back"
            className="cursor-pointer p-1"
            onClick={handleGoBack}
          >
            <Iconify icon="fluent:ios-arrow-24-filled" />
          </Button>
        )}
        <h1 className="text-2xl font-semibold ml-1">{title}</h1>
      </RowSpace>

      <RowSpace>
        {leftSection}
        <HeaderActions actions={actions} />
        {rightSection}
      </RowSpace>
    </RowSpace>
  );
};
