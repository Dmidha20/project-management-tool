import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

import { Iconify } from "@app/components/ui";
import { CustomAvatar } from "@app/components/ui/custom-avatar";
// import { logout } from '@app/modules/app';
// import { useProfile } from '@app/modules/profile';
// import { PATH_DASHBOARD } from '@app/routes';
// import type { AppDispatch } from '@app/store';

interface NavAccountProps {
  mini?: boolean;
}

export default function NavAccount({ mini = false }: NavAccountProps) {
  const [open, setOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  // const navigate = useNavigate();
  // const dispatch = useDispatch<AppDispatch>();
  const popoverRef = useRef<HTMLDivElement>(null);

  // const { profile } = useProfile();

  const fullName = "John Doe";

  const updatePopoverPosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    let top = rect.top - 100;
    let left = rect.right + 40;
    if (screenWidth < 640) {
      top = rect.top - 180;
      left = rect.left;
    }

    setPopoverPosition({ top, left });
  }, []);

  useEffect(() => {
    if (!open) return;

    updatePopoverPosition();
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, updatePopoverPosition]);

  const handleMyProfileClick = () => {
    setOpen(false);
    // navigate(PATH_DASHBOARD.myProfile);
  };
  // const handleLogoutClick = () => {
  //   dispatch(logout());
  // };

  const popoverContent = (
    <div
      ref={popoverRef}
      className="fixed w-56 bg-white shadow-xl rounded-lg border border-gray-200 z-[9999] animate-in fade-in-0 zoom-in-95"
      style={{
        top: `${popoverPosition.top}px`,
        left: `${popoverPosition.left}px`,
      }}
    >
      <div className="flex items-center p-4 border-b border-gray-300">
        <CustomAvatar
          name={fullName}
          color="primary"
          className="w-12 h-12 text-lg"
        />
        <div className="ml-3">
          <p className="text-sm font-semibold text-gray-700">{fullName}</p>
          <p className="text-xs text-gray-500">Administrator</p>
        </div>
      </div>
      <div className="flex flex-col">
        <button
          onClick={handleMyProfileClick}
          className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm"
        >
          <Iconify icon="material-symbols:person" className="text-gray-500" />
          {"Profile"}
        </button>
        <button
          // onClick={handleLogoutClick}
          className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 text-gray-700 text-sm"
        >
          <Iconify icon="material-symbols:logout" className="text-gray-500" />
          {"LogOut"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      <div
        ref={buttonRef}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) =>
          (e.key === "Enter" || e.key === " ") && setOpen(!open)
        }
        className={`flex items-center rounded-xl border border-white/5 bg-white/[0.04] text-white transition hover:bg-white/[0.08] cursor-pointer ${mini ? "justify-center p-2" : "p-2.5"} `}
      >
        <CustomAvatar
          name={fullName}
          color="primary"
          className={`h-9 w-9 text-sm ${mini ? "" : ""}`}
        />

        {!mini && (
          <div className="ml-2 min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-100">
              {fullName}
            </span>
            <p className="mt-0.5 text-[11px] text-slate-400">Administrator</p>
          </div>
        )}
        {!mini && <Iconify icon="eva:arrow-ios-downward-fill" className="h-4 w-4 text-slate-400" />}
      </div>
      {open && createPortal(popoverContent, document.body)}
    </div>
  );
}
