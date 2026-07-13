import { useId, useMemo, useRef } from "react";
import type { ReactElement } from "react";

import { ProgressBar } from "../progress-bar";
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  type HeadCell,
  type IBulkActionCallback,
  type TableProps,
} from "../table";

export type RowDataType<TRowDataType extends object> = TRowDataType & {
  id: string;
};

export type SelectionActionsType = (props: {
  selectedCount: number;
  onCancel: () => void;
  onBulkAction: (type: Parameters<IBulkActionCallback<unknown>>[0]) => void;
}) => ReactElement;

interface Props<TRowDataType extends object> {
  children: (row: RowDataType<TRowDataType>) => ReactElement;
  data?: Array<RowDataType<TRowDataType>>;
  head: Array<HeadCell<keyof TRowDataType>>;
  tableProps: TableProps<TRowDataType>;
  loading?: boolean;
  totalCount?: number;
  isServerSidePaging?: boolean;
  paginationShown?: boolean;
  className?: string;
  renderSelectionActions?: SelectionActionsType | undefined;
}

export default function PaginatedTable<TRowDataType extends object>({
  data: records = [],
  head,
  children,
  tableProps,
  loading,
  totalCount,
  isServerSidePaging = true,
  paginationShown = true,
  className = "",
  renderSelectionActions,
}: Props<TRowDataType>) {
  const {
    selected,
    page: tablePage,
    rowsPerPage,
    orderBy,
    order,
    onChangeRowsPerPage,
    onChangePage,
    onSort,
    onBulkAction,
    clearSelection,
  } = tableProps;

  const page = tablePage - 1;

  const containerRef = useRef<HTMLDivElement>(null);
  const tableClassId = useId().replace(/:/g, "");

  let data = records;

  if (!isServerSidePaging && orderBy) {
    const sortKey = orderBy as keyof RowDataType<TRowDataType>;
    data = [...records].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }

  const visibleColumns = useMemo(
    () => head.filter((item) => !item.hidden),
    [head],
  );

  const leftFrozenIndexes = useMemo(
    () =>
      visibleColumns
        .map((column, index) => ({ column, index: index + 1 }))
        .filter(
          ({ column }) =>
            column.freeze && (column.freezeSide ?? "left") === "left",
        ),
    [visibleColumns],
  );

  const rightFrozenIndexes = useMemo(
    () =>
      visibleColumns
        .map((column, index) => ({ column, index: index + 1 }))
        .filter(({ column }) => column.freeze && column.freezeSide === "right"),
    [visibleColumns],
  );

  const freezeStyles = useMemo(() => {
    const styles: string[] = [];

    leftFrozenIndexes.forEach(({ index }) => {
      styles.push(`
        .${tableClassId} tbody tr > *:nth-child(${index}) {
          position: sticky;
          left: 0;
          z-index: 20;
          background: white;
        }
      `);
    });

    rightFrozenIndexes.forEach(({ index }) => {
      styles.push(`
        .${tableClassId} tbody tr > *:nth-child(${index}) {
          position: sticky;
          right: 0;
          z-index: 20;
          background: white;
        }
      `);
    });

    return styles.join("\n");
  }, [leftFrozenIndexes, rightFrozenIndexes, tableClassId]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full overflow-hidden ${className}`}
    >
      {!!freezeStyles && <style>{freezeStyles}</style>}

      <div
        className={`flex-1 overflow-auto min-h-[120px]`}
        data-testid="table-scroll-area"
      >
        <table
          className={`min-w-full w-full table-auto border-collapse text-sm text-gray-600 ${tableClassId}`}
        >
          <TableHeadCustom
            order={order}
            orderBy={orderBy}
            headLabel={head}
            rowCount={data.length}
            numSelected={selected.length}
            onSort={onSort}
            className="sticky top-0 bg-gray-100 z-30"
          />
          <tbody className="divide-y divide-gray-200">
            {loading && (
              <tr>
                <th colSpan={head.length} className="p-0">
                  <ProgressBar
                    height="h-0.5"
                    color="bg-blue-500"
                    trackColor="bg-gray-200"
                  />
                </th>
              </tr>
            )}
            {!isServerSidePaging &&
              data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    onDoubleClick={() => tableProps.onRowPress?.(row)}
                  >
                    {children(row)}
                  </tr>
                ))}
            {isServerSidePaging &&
              data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  onDoubleClick={() => tableProps.onRowPress?.(row)}
                >
                  {children(row)}
                </tr>
              ))}

            {!loading && data.length === 0 && <TableNoData />}
          </tbody>
        </table>
      </div>
      <div className="sticky bottom-0 bg-white shadow-md">
        {paginationShown && (
          <TablePaginationCustom
            count={totalCount ?? data.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        )}
        {renderSelectionActions &&
          selected.length > 0 &&
          renderSelectionActions({
            selectedCount: selected.length,
            onCancel: () => {
              clearSelection?.();
            },
            onBulkAction: (type) => onBulkAction(type, tableProps.selected),
          })}
      </div>
    </div>
  );
}
