import type { JSX } from 'react';

export type IBulkActionCallback<T> = (
  type:
    | 'save'
    | 'edit'
    | 'active'
    | 'inactive'
    | 'remove-selection'
    | 'reply'
    | 'link-page'
    | 'resolve'
    | string,
  selectedRows: T[],
) => void;

export interface TableProps<T> {
  dense: boolean;
  order: 'asc' | 'desc';
  page: number;
  orderBy: string;
  rowsPerPage: number;

  selected: T[];
  selectedIds: Set<string>;

  isSelected: (id: string) => boolean;
  onSelectRow: (row: T) => void;
  onSelectAllRows: (checked: boolean, rows: T[]) => void;
  onBulkAction: IBulkActionCallback<T>;
  onRowPress: (row: T) => void;

  clearSelection: () => void;
  setSelected: (rows: T[]) => void;

  onSort: (id: string) => void;
  onChangePage: (newPage: number) => void;
  onChangeRowsPerPage: (rows: number) => void;
  onChangeDense: (event: React.ChangeEvent<HTMLInputElement>) => void;

  setPage: React.Dispatch<React.SetStateAction<number>>;
  setDense: React.Dispatch<React.SetStateAction<boolean>>;
  setOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface UseTableProps<T> {
  defaultDense?: boolean;
  defaultOrderBy?: string;
  defaultOrder?: 'asc' | 'desc';
  defaultCurrentPage?: number;
  defaultRowsPerPage?: number;
  defaultSelected?: T[];
  onBulkAction?: IBulkActionCallback<T>;
  onRowPress?: (row: T) => void;
}
export interface HeadCell<T = string> {
  id: T | 'selected' | 'action';
  label?: string | JSX.Element;
  align?: string;
  width?: string | number;
  minWidth?: string | number;
  sortable?: boolean;
  hidden?: boolean;
  sortId?: string;
  freeze?: boolean;
  freezeSide?: 'left' | 'right';
}
