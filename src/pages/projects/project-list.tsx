import { ProjectRow } from "./project-row";
import { type HeadCell, type TableProps } from "@app/components/ui/table";
import {
  PaginatedTable,
  type SelectionActionsType,
} from "@app/components/ui/paginated-table";
import type { IProject } from "./types";

interface Props {
  tableProps: TableProps<IProject>;
  rows?: IProject[];
  loading: boolean;
  totalCount: number;
  renderSelectionActions: SelectionActionsType;
}

type ProjectRowKeys = keyof IProject;

const ProjectList = ({
  tableProps,
  rows = [],
  loading,
  totalCount,
  renderSelectionActions,
}: Props) => {
  const TABLE_HEAD: HeadCell<ProjectRowKeys>[] = [
    {
      id: "name",
      label: "Project",
      align: "left",
      sortable: true,
      sortId: "name",
    },

    {
      id: "owner",
      label: "Owner",
      align: "center",
      sortable: true,
      sortId: "owner",
    },

    {
      id: "priority",
      label: "Priority",
      align: "center",
      sortable: true,
      sortId: "priority",
    },

    {
      id: "status",
      label: "Status",
      align: "center",
      sortable: true,
      sortId: "status",
    },

    {
      id: "progress",
      label: "Progress",
      align: "center",
      sortable: true,
      sortId: "progress",
    },

    {
      id: "members",
      label: "Members",
      align: "center",
      sortable: false,
    },

    {
      id: "dueDate",
      label: "Due Date",
      align: "center",
      sortable: true,
      sortId: "dueDate",
    },

    {
      id: "action",
      label: "Action",
      align: "center",
      sortable: false,
    },
  ];

  return (
    <PaginatedTable<IProject>
      head={TABLE_HEAD}
      tableProps={tableProps}
      data={rows}
      loading={loading}
      totalCount={totalCount}
      renderSelectionActions={renderSelectionActions}
      className="flex-grow overflow-hidden"
    >
      {(row) => (
        <ProjectRow
          row={row}
          selected={tableProps.isSelected(row.id)}
          onSelectRow={tableProps.onSelectRow}
          onRowAction={tableProps.onBulkAction}
        />
      )}
    </PaginatedTable>
  );
};

export { ProjectList };
