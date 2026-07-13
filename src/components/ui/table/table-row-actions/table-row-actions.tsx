import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../button';
import { Iconify } from '../../iconify';



export interface TableRowActionItem {
  label: string;
  onClick: () => void;
  icon?: string;
  className?: string;
  variant?: 'default' | 'danger';
  hasPermission?: boolean;
}

interface TableRowActionsProps {
  actions: TableRowActionItem[];
  buttonClassName?: string;
  menuClassName?: string;
}

export function TableRowActions({ actions, buttonClassName, menuClassName }: TableRowActionsProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    setCoords({ x: rect.left, y: rect.bottom });
    setOpenMenu((prev) => !prev);
  };

  const handleActionClick = (action: TableRowActionItem) => {
    action.onClick();
    setOpenMenu(false);
  };

  useLayoutEffect(() => {
    if (!openMenu) return;
    if (!wrapperRef.current || !menuRef.current) return;

    const margin = 8;

    const triggerRect = wrapperRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spaceBelow = vh - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const spaceRight = vw - triggerRect.right;
    const spaceLeft = triggerRect.left;

    const openDown = spaceBelow >= menuRect.height + margin || spaceBelow >= spaceAbove;
    const openRight = spaceRight >= menuRect.width + margin || spaceRight >= spaceLeft;

    let x = openRight ? triggerRect.left : triggerRect.right - menuRect.width;
    let y = openDown ? triggerRect.bottom : triggerRect.top - menuRect.height;

    y = openDown ? y + 4 : y - 4;

    x = Math.max(margin, Math.min(x, vw - menuRect.width - margin));
    y = Math.max(margin, Math.min(y, vh - menuRect.height - margin));

    setCoords({ x, y });
  }, [openMenu]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!openMenu) return;

      const target = e.target as Node;

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpenMenu(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && openMenu) {
        setOpenMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openMenu]);

  return (
    <>
      <div ref={wrapperRef} className="inline-block">
        <Button
          variant="clear"
          onClick={toggleMenu}
          className={`p-2 rounded-full hover:bg-gray-200 ${buttonClassName || ''}`}
          aria-label="Row actions"
          aria-expanded={openMenu}
          aria-haspopup="menu"
        >
          <Iconify icon="eva:more-vertical-fill" />
        </Button>
      </div>

      {openMenu &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            tabIndex={-1}
            style={{
              position: 'fixed',
              top: coords.y,
              left: coords.x,
              zIndex: 99999,
            }}
            className={`w-40 rounded-md bg-white shadow-lg p-1 ${menuClassName || ''}`}
          >
            {actions.map((action, index) => {
              const variantClass =
                action.variant === 'danger'
                  ? 'text-red-700 hover:bg-red-50'
                  : 'text-gray-700 hover:bg-gray-100';

              if (action.hasPermission === false) {
                return null;
              }

              return (
                <Button
                  key={index}
                  role="menuitem"
                  variant="clear"
                  onClick={() => handleActionClick(action)}
                  className={`flex items-center gap-2 w-full px-4 py-2 text-left ${variantClass} ${action.className || ''}`}
                >
                  {action.icon && <Iconify icon={action.icon} size={18} />}
                  <span>{action.label}</span>
                </Button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
