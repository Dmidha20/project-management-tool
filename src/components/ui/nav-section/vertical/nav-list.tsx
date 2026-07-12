import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useActiveLink } from '@app/hooks';

import { type NavListProps } from '../types';
import NavItem from './nav-item';

// ----------------------------------------------------------------------

interface NavListRootProps {
  data: NavListProps;
  depth: number;
  hasChild: boolean;
  mini?: boolean;
}

export default function NavList({ data, depth, hasChild, mini = false }: NavListRootProps) {
  const { pathname } = useLocation();
  const { active, isExternalLink } = useActiveLink(data.path, false);

  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (!active) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggle = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  if (data.divider) {
    return <hr className="my-3 border-t border-white/10" />;
  }

  return (
    <div className="flex flex-col">
      <NavItem
        item={data}
        depth={depth}
        open={open}
        active={data.children ? false : active}
        isExternalLink={isExternalLink}
        onClick={handleToggle}
        mini={mini}
      />

      {hasChild && open && <NavSubList data={data.children ?? []} depth={depth} />}
    </div>
  );
}

// ----------------------------------------------------------------------

interface NavListSubProps {
  data: NavListProps[];
  depth: number;
  mini?: boolean;
}

function NavSubList({ data, depth, mini }: NavListSubProps) {
  return (
    <div className="flex flex-col gap-1" style={{ paddingLeft: depth * 16 }}>
      {data.map((list, index) => (
        <NavList
          key={index}
          data={list}
          depth={2}
          hasChild={!!list.children}
          mini={mini ?? false}
        />
      ))}
    </div>
  );
}
