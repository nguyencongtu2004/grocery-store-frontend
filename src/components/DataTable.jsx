import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import { Edit, Eye, Trash2 } from "lucide-react";
import PropTypes from "prop-types";

export function DataTable({
  data,
  columns,
  isLoading,
  emptyContent,
  bottomContent,
}) {
  return (
    <Table aria-label="Data table" bottomContent={bottomContent}>
      <TableHeader>
        {columns.map((column) => (
          <TableColumn key={column.key} align={column.align || "start"}>
            {column.label}
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody
        items={data}
        emptyContent={isLoading ? <Spinner size="lg" /> : emptyContent || "No data"}
      >
        {(item) => (
          <TableRow key={item._id}>
            {columns.map((column, columnIndex) => (
              <TableCell key={`${item._id}-${column.key}`}>
                {column.render
                  ? column.render(item, columnIndex)
                  : item[column.key]}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export function ActionCell({
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="relative flex items-center gap-2">
      {onView && (
        <Tooltip content="Detail">
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            <Eye size={20} onClick={onView} />
          </span>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip content="Edit">
          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
            <Edit size={20} onClick={onEdit} />
          </span>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip color="danger" content="Delete">
          <span className="text-lg text-danger cursor-pointer active:opacity-50">
            <Trash2 size={20} onClick={onDelete} />
          </span>
        </Tooltip>
      )}
    </div>
  );
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  emptyContent: PropTypes.node,
  bottomContent: PropTypes.node,
};

ActionCell.propTypes = {
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};