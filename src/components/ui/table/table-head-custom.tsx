import clsx from 'clsx';
import { useCallback } from 'react';

import type { HeadCell } from './types';
import { Iconify } from '../iconify';

const visuallyHidden =
  'absolute w-px h-px p-0 m-[-1px] overflow-hidden border-0 whitespace-nowrap clip-rect';

interface Props<TRowDataType> {
  order?: 'asc' | 'desc';
  orderBy?: string;
  headLabel: HeadCell<keyof TRowDataType>[];
  rowCount?: number;
  numSelected?: number;
  onSort?: (id: string) => void;
  onSelectAllRows?: (checked: boolean) => void;
  className?: string;
}

const getFreezeClasses = <TRowDataType,>(headCell: HeadCell<keyof TRowDataType>) => {
  if (!headCell.freeze) return '';

  if (headCell.freezeSide === 'right') {
    return 'sticky top-0 right-0 z-40 bg-gray-200';
  }

  return 'sticky top-0 left-0 z-40 bg-gray-200';
};

export default function TableHeadCustom<TRowDataType>({
  order,
  orderBy,
  headLabel,
  onSort,
  className = '',
}: Props<TRowDataType>) {
  const handleSort = useCallback(
    (id: string) => {
      onSort?.(id);
    },
    [onSort],
  );

  return (
    <thead className={`bg-gray-200 text-gray-700 text-xs ${className}`}>
      <tr>
        {headLabel.map((headCell) => {
          const isActive = orderBy === headCell.sortId;

          if (headCell.hidden) {
            return null;
          }

          return (
            <th
              key={String(headCell.id)}
              className={clsx(
                'px-2 py-2.5 font-bold',
                headCell.align === 'right'
                  ? 'text-right'
                  : headCell.align === 'center'
                    ? 'text-center'
                    : 'text-left',
                getFreezeClasses(headCell),
              )}
              style={{
                width: headCell.width,
                minWidth: headCell.minWidth,
              }}
            >
              {headCell?.sortable && onSort ? (
                <button
                  type="button"
                  onClick={() => handleSort(String(headCell.sortId))}
                  className={clsx(
                    'text-neutral-500 font-bold flex items-center gap-1 capitalize group w-full',
                    headCell.align === 'center' && 'justify-center',
                    headCell.align === 'right' && 'justify-end',
                    headCell.align === 'left' && 'justify-start',
                    'cursor-pointer',
                  )}
                >
                  <span
                    className={clsx(
                      'text-neutral-500 font-bold border-b border-dashed border-gray-500 group-hover:border-gray-700',
                      isActive ? 'text-neutral-700' : '',
                    )}
                    style={{
                      borderBottomStyle: 'dashed',
                      borderBottomWidth: '1px',
                      marginBottom: '2px',
                      display: 'inline-block',
                    }}
                  >
                    {headCell.label}
                  </span>
                  {isActive && (
                    <span
                      className={`inline-block transition-transform ${order === 'desc' ? 'rotate-180' : ''}`}
                    >
                      <Iconify className="h-4 w-4 text-neutral-700" icon="raphael:arrowup" />
                    </span>
                  )}
                  {isActive && (
                    <span className={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  )}
                </button>
              ) : (
                <span
                  className={clsx(
                    'text-neutral-500 font-bold whitespace-pre-line',
                    headCell.align === 'center' && 'text-center',
                    headCell.align === 'right' && 'text-right',
                    headCell.align === 'left' && 'text-left',
                  )}
                >
                  {headCell.label}
                </span>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
