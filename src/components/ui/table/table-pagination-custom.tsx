import { Icon } from '@iconify/react';

interface Props {
  dense?: boolean;
  onChangeDense?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPageOptions?: number[];
  page: number;
  count: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  className?: string;
}
export default function TablePaginationCustom({
  dense = false,
  onChangeDense,
  rowsPerPageOptions = [10, 25, 50, 100],
  page,
  count,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  className = '',
}: Props) {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handlePrevious = () => {
    if (page > 0) onPageChange(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages - 1) onPageChange(page + 1);
  };

  return (
    <div className={`flex items-center justify-end p-2 gap-x-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm">
        <span>Rows per page:</span>
        <select
          className="border-none rounded px-2 py-1 text-sm focus:outline-none focus:ring-0"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        >
          {rowsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="text-sm">
        {count === 0
          ? '0 of 0'
          : `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, count)} of ${count}`}
      </div>
      <div className="flex items-center gap-1">
        <Icon
          icon="ic:chevron-left"
          width={22}
          height={22}
          color={page === 0 ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0)'}
          className={`${page === 0 ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
          onClick={() => {
            handlePrevious();
          }}
        />
        <Icon
          icon="ic:chevron-right"
          width={22}
          height={22}
          color={page >= totalPages - 1 ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0)'}
          className={`${page >= totalPages - 1 ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
          onClick={() => {
            handleNext();
          }}
        />
      </div>
      {onChangeDense && (
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={dense}
            onChange={onChangeDense}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm">Dense</span>
        </label>
      )}
    </div>
  );
}
