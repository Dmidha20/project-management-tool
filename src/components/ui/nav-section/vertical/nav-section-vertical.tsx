import { type NavSectionProps } from '../types';
import NavList from './nav-list';

export default function NavSectionVertical({ data, mini = false, ...other }: NavSectionProps) {
  return (
    <div className="flex flex-col" {...other}>
      {data.map((item) => (
        <NavList key={item.title} data={item} depth={1} hasChild={!!item.children} mini={mini} />
      ))}
    </div>
  );
}
