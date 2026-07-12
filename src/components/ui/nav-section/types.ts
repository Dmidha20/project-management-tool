export interface INavItem {
  item: NavListProps;
  depth: number;
  open?: boolean;
  active?: boolean;
  isExternalLink?: boolean;
  mini?: boolean;
}

export type NavItemProps = INavItem & React.HTMLAttributes<HTMLDivElement>;

export interface NavListProps {
  title: string;
  path: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  caption?: string;
  disabled?: boolean;
  roles?: string[];
  children?: NavListProps[];
  divider?: boolean;
}

export interface NavSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  data: NavListProps[];
  item?: string;
  mini?: boolean;
}
