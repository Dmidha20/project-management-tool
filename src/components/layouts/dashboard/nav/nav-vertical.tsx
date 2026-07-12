import type { CSSProperties } from 'react';

import { Iconify } from '@app/components/ui'



import navConfig from './config-navigation';
import NavAccount from './nav-account';
import { NAV } from '@app/configs';
import { useResponsive } from '@app/hooks/use-responsive';
import { Logo } from '@app/components/ui/logo';
import { NavSectionVertical } from '@app/components/ui/nav-section';

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
            className="fixed top-2 right-6 z-50 flex justify-end p-2 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          bg-[var(--color-brand-50)]
        `}
        style={
          {
            transition: 'width 0.3s ease',
            '--nav-width': collapsed ? `${NAV.W_DASHBOARD_MINI}px` : `${NAV.W_DASHBOARD}px`,
          } as CSSVariables
        }
      >
        <div className="relative flex items-center justify-center py-6">
          {!collapsed && <Logo disabledLink size="xxl" variant="dark" className="w-36" />}

          {!isMobile && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="absolute right-6 top-2 rounded-md p-1 text-gray-500 hover:bg-gray-200 cursor-pointer"
            >
              <Iconify
                icon={collapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'}
                className="w-5 h-5"
              />
            </button>
          )}
        </div>

        <div className="h-full overflow-y-auto px-4 pt-6 pb-6">
          <NavSectionVertical  data={filteredNavConfig} mini={collapsed} />
        </div>

        <div className="p-4 mt-auto shrink-0">
          <NavAccount mini={collapsed} />
        </div>
      </aside>
    </>
  );
}
