import { useLocation, matchPath } from 'react-router-dom';

// ----------------------------------------------------------------------

interface ReturnType {
  active: boolean;
  isExternalLink: boolean;
}

export function useActiveLink(path: string, deep = true): ReturnType {
  const { pathname } = useLocation();

  const normalActive = path ? !!matchPath({ path, end: false }, pathname) : false;

  const deepActive = path ? !!matchPath({ path, end: true }, pathname) : false;

  return {
    active: deep ? deepActive : normalActive,
    isExternalLink: path.includes('http'),
  };
}
