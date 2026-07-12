import { useState, useEffect } from 'react';

type Query = 'up' | 'down' | 'between' | 'only';
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type Value = Breakpoint | number;

const TAILWIND_BREAKPOINTS: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useResponsive(query: Query, start?: Value, end?: Value): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;

      const startPx = typeof start === 'number' ? start : start ? TAILWIND_BREAKPOINTS[start] : 0;
      const endPx =
        typeof end === 'number' ? end : end ? TAILWIND_BREAKPOINTS[end as Breakpoint] : Infinity;

      switch (query) {
        case 'up':
          setMatches(width >= startPx);
          break;
        case 'down':
          setMatches(width <= startPx);
          break;
        case 'between':
          setMatches(width >= startPx && width <= endPx);
          break;
        case 'only':
          setMatches(width >= startPx && width < endPx);
          break;
        default:
          setMatches(false);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [query, start, end]);

  return matches;
}

export function useWidth(): Breakpoint {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const keys: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm'];
  for (const key of keys) {
    if (width >= TAILWIND_BREAKPOINTS[key]) return key;
  }

  return 'sm';
}
