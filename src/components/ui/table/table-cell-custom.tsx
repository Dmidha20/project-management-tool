import React from 'react';

interface TableCellCustomProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  width?: string | number;
  flex?: boolean;
  children?: React.ReactNode;
  maxLines?: number;
}

const TableCellCustom = ({
  width,
  flex,
  children,
  className = '',
  maxLines,
  ...rest
}: TableCellCustomProps) => {
  const flexStyle = flex ? 'flex-1' : '';

  // Style for line clamping (to be applied to a wrapper div)
  const clampStyle = maxLines
    ? {
        display: '-webkit-box',
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
      }
    : undefined;

  return (
    <td
      className={`px-4 py-2 text-center align-middle ${flexStyle} ${className}`}
      style={{
        minWidth: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        wordWrap: 'break-word',
        whiteSpace: 'normal',
        maxWidth: '400px',
      }}
      {...rest}
    >
      {maxLines ? <div style={clampStyle}>{children}</div> : children}
    </td>
  );
};

export default TableCellCustom;
