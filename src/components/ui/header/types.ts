export interface IExportHeaders {
  label: string;
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapValue?: (value: any) => any;
}

export interface ExportProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  csvHead?: IExportHeaders[];
  fileName: string;
}

export interface HeaderAction {
  label: string;
  className?: string;
  onClick: () => void;
  visible?: boolean;
}

export interface HeaderProps {
  title: string;
  shownBackButton?: boolean;
  helperText?: string;
  actions?: HeaderAction[];
  onClickHelperText?: () => void;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  hidden?: boolean;
}
