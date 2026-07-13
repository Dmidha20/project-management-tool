import { useCallback, useMemo, useState } from 'react';

import type { IBulkActionCallback, TableProps, UseTableProps } from './types';

export default function useTable<T extends { id: string }>(
  props?: UseTableProps<T>,
): TableProps<T> {
  const [dense, setDense] = useState(!!props?.defaultDense);
  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy ?? 'createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>(props?.defaultOrder ?? 'desc');
  const [page, setPage] = useState(props?.defaultCurrentPage ?? 1);
  const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage ?? 10);

  const [selectedMap, setSelectedMap] = useState<Map<string, T>>(() => {
    const map = new Map<string, T>();
    props?.defaultSelected?.forEach((item) => {
      map.set(String(item.id), item);
    });

    return map;
  });

  const setSelected = useCallback((rows: T[]) => {
    const newMap = new Map<string, T>();

    rows.forEach((row) => {
      newMap.set(String(row.id), row);
    });

    setSelectedMap(newMap);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMap(new Map());
  }, []);

  const onSelectRow = useCallback((row: T) => {
    setSelectedMap((prev) => {
      const newMap = new Map(prev);
      const id = String(row.id);

      if (newMap.has(id)) {
        newMap.delete(id);
      } else {
        newMap.set(id, row);
      }

      return newMap;
    });
  }, []);

  const onSelectAllRows = useCallback((checked: boolean, rows: T[]) => {
    if (!checked) {
      setSelectedMap(new Map());

      return;
    }

    const newMap = new Map<string, T>();
    rows.forEach((row) => {
      newMap.set(String(row.id), row);
    });

    setSelectedMap(newMap);
  }, []);

  const selected = useMemo(() => Array.from(selectedMap.values()), [selectedMap]);

  const selectedIds = useMemo(() => new Set(selectedMap.keys()), [selectedMap]);

  const isSelected = useCallback((id: string) => selectedIds.has(String(id)), [selectedIds]);

  /* -------------------- SORTING -------------------- */

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';

      if (id !== '') {
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
        setPage(1);
      }
    },
    [order, orderBy],
  );

  const onBulkAction: IBulkActionCallback<T> = useCallback(
    (type, selectedRows?: T[]) => {
      const rows = selectedRows ?? Array.from(selectedMap.values());
      props?.onBulkAction?.(type, rows);
    },
    [props, selectedMap],
  );

  const onChangePage = useCallback((newPage: number) => {
    setPage(newPage + 1);
  }, []);

  const onChangeRowsPerPage = useCallback((rows: number) => {
    setPage(1);
    setRowsPerPage(rows);
  }, []);

  const onChangeDense = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setDense(event.target.checked),
    [],
  );

  const onRowPress = props?.onRowPress ?? (() => {});

  return {
    dense,
    order,
    page,
    orderBy,
    rowsPerPage,

    selected,
    selectedIds,

    isSelected,
    onSelectRow,
    onSelectAllRows,
    onBulkAction,
    onRowPress,

    clearSelection,
    setSelected,

    onSort,
    onChangePage,
    onChangeDense,
    onChangeRowsPerPage,

    setPage,
    setDense,
    setOrder,
    setOrderBy,
    setRowsPerPage,
  };
}
