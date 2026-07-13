import type { CSSProperties } from 'react';

import { Iconify } from '@app/components/ui'



import navConfig from './config-navigation';
import NavAccount from './nav-account';
import { NAV } from '@app/configs';
import { useResponsive } from '@app/hooks/use-responsive';
import { NavSectionVertical } from '@app/components/ui/nav-section';
import pmtLogo from '@app/assets/pmt_logo1.png';

interface Props {
  openNav: boolean;
  onCloseNav: VoidFunction;
  collapsed: boolean;
  onToggleCollapse: VoidFunction;
}

interface CSSVariables extends CSSProperties {
  '--nav-width'?: string;
}

interface INavConfig {
  title: string;
  path: string;
  icon: string;
  hidden?: boolean;
}

export default function NavVertical({ openNav, onCloseNav, collapsed, onToggleCollapse }: Props) {
  const isMobile = useResponsive('down', 'sm');
  const filteredNavConfig = navConfig.filter((item) => !(item as unknown as INavConfig).hidden);

  return (
    <>
      {isMobile && openNav && (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0"
            onClick={onCloseNav}
          />
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onCloseNav}
            className="fixed top-2 right-6 z-50 flex justify-end p-2 rounded-md text-[var(--color-text-disabled)] hover:text-[var(--color-icon-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
          >
            <Iconify icon="fluent-emoji-high-contrast:cross-mark" className="w-6 h-6" />
          </button>
        </>
      )}
      <aside
        className={`
          fixed top-0 left-0 h-screen flex flex-col z-40
          ${isMobile ? 'w-64 transition-transform duration-300' : 'w-[var(--nav-width)]'}
          ${isMobile ? (openNav ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          border-r border-[var(--color-text-white)]/5 bg-[var(--color-sidebar)] shadow-xl shadow-[var(--color-neutral-900)]/20
        `}
        style={
          {
            transition: 'width 0.3s ease',
            '--nav-width': collapsed ? `${NAV.W_DASHBOARD_MINI}px` : `${NAV.W_DASHBOARD}px`,
          } as CSSVariables
        }
      >
        <div className="relative flex h-[92px] items-center px-5">
          {!collapsed && (
            <div className="-ml-5 h-[60px] w-44 overflow-hidden">
              <img
                src={pmtLogo}
                alt="PMT"
                className="-mt-[25px] w-44 max-w-none brightness-0 invert"
              />
            </div>
          )}

          {!isMobile && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--color-text-disabled)] hover:bg-[var(--color-text-white)]/10 hover:text-[var(--color-text-white)] cursor-pointer"
            >
              <Iconify
                icon={collapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'}
                className="w-5 h-5"
              />
            </button>
          )}
        </div>

        <div className="h-full overflow-y-auto px-3 pb-4 pt-2 [scrollbar-width:none]">
          <NavSectionVertical className="gap-1" data={filteredNavConfig} mini={collapsed} />
        </div>

        <div className="mt-auto shrink-0 p-3">
          <NavAccount mini={collapsed} />
        </div>
      </aside>
    </>
  );
}
