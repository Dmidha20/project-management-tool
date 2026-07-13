import type { IProject } from "./types";

import {
  TableCellCustom,
  type IBulkActionCallback,
} from "@app/components/ui/table";
import { Avatar } from "@app/components/ui/avatar";
import { StatusChip } from "@app/components/ui/chips/statusChip";
import { RowActions } from "./row-action";

interface Props {
  row: IProject;
  selected?: boolean;
  onSelectRow: (row: IProject) => void;
  onRowAction: IBulkActionCallback<IProject>;
}

const ProjectRow = ({
  row,
  selected = false,
  onSelectRow,
  onRowAction,
}: Props) => {
  return (
    <>
      {/* Project */}

      <TableCellCustom>
        <div className="flex flex-col">
          <span className="font-medium text-[var(--color-text-primary)]">
            {row.name}
          </span>

          <span className="text-xs text-[var(--color-text-secondary)]">
            #{row.id}
          </span>
        </div>
      </TableCellCustom>

      {/* Owner */}

      <TableCellCustom align="center">
        <div className="flex items-center justify-center gap-2">
          <Avatar src={row.ownerAvatar} />

          <span>{row.owner}</span>
        </div>
      </TableCellCustom>

      {/* Priority */}

      <TableCellCustom align="center">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium
          ${
            row.priority === "High"
              ? "bg-red-100 text-red-700"
              : row.priority === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          {row.priority}
        </span>
      </TableCellCustom>

      {/* Status */}

      <TableCellCustom align="center">
        <StatusChip status={row.status} />
      </TableCellCustom>

      {/* Progress */}

      <TableCellCustom align="center">
        <div className="flex items-center gap-3">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--color-border)]">
            <div
              className="h-full rounded-full bg-[var(--color-primary)]"
              style={{
                width: `${row.progress}%`,
              }}
            />
          </div>

          <span className="text-sm font-medium">{row.progress}%</span>
        </div>
      </TableCellCustom>

      {/* Members */}

      <TableCellCustom align="center">{row.members}</TableCellCustom>

      {/* Due Date */}

      <TableCellCustom align="center">{row.dueDate}</TableCellCustom>

      {/* Actions */}

      <TableCellCustom align="center">
        <RowActions
          row={row}
          onRowAction={(action, selectedRow) =>
            onRowAction(action, [selectedRow])
          }
        />
      </TableCellCustom>
    </>
  );
};

export { ProjectRow };
