import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./Dropdown";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T extends { id: number | string }> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  actionButton?: boolean;
}

export default function DataTable<T extends { id: number | string }>({
  columns,
  data,
  onRowClick,
  actionButton,
}: DataTableProps<T>) {
  return (
    <div className="relative overflow-visible">
      <table className="w-full text-sm text-left">
        {/* Table header */}
        <thead className="bg-gray-200 text-gray-700 border border-primary-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 font-medium text-sm ${
                  column.className || ""
                }`}
              >
                {column.header}
              </th>
            ))}
            {actionButton && <th>Thao tác</th>}
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-gray-50 border border-primary-50 cursor-pointer hover:bg-gray-100"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-6 py-4 ${column.className || ""}`}
                >
                  {typeof column.accessor === "function"
                    ? column.accessor(row)
                    : String(row[column.accessor as keyof T] ?? "")}
                </td>
              ))}
              {actionButton && (
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <Dropdown>
                    <Dropdown.Trigger >
                      <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        className="size-5 cursor-pointer text-gray-600 hover:text-gray-800"
                      />
                    </Dropdown.Trigger>
                    <Dropdown.Content align="left" width="32" contentClasses="py-1 bg-white">
                      <Dropdown.Link className="text-primary-600">
                        <FontAwesomeIcon icon={faPenToSquare} className="mr-2 size-4" />
                        Sửa
                      </Dropdown.Link>
                      <Dropdown.Link className="text-red-600">
                        <FontAwesomeIcon icon={faTrash} className="mr-2 size-4" />
                        Xoá
                      </Dropdown.Link>
                    </Dropdown.Content>
                  </Dropdown>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
