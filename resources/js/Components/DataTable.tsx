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
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function DataTable<T extends { id: number | string }>({
  columns,
  data,
  onRowClick,
  onEdit,
  onDelete,
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
            {onEdit && onDelete && (
              <th className="px-2 py-3 font-medium text-sm w-32">Thao tác</th>
            )}
          </tr>
        </thead>

        {/* Table body */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-gray-50 border border-primary-50 cursor-pointer hover:bg-gray-100"
              onClick={() => onRowClick?.(row)}
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
              {onEdit && onDelete && (
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <Dropdown>
                    <Dropdown.Trigger>
                      <FontAwesomeIcon
                        icon={faEllipsisVertical}
                        className="size-5 cursor-pointer text-gray-600 hover:text-gray-800"
                      />
                    </Dropdown.Trigger>
                    <Dropdown.Content
                      align="right"
                      width="28"
                      contentClasses="py-1 bg-white"
                    >
                      <button
                        className="block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-primary-600"
                        onClick={() => onEdit(row)}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="mr-2 size-3"
                        />
                        Sửa
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-start text-sm leading-5 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-red-600"
                        onClick={() => onDelete(row)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="mr-2 size-3"
                        />
                        Xoá
                      </button>
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
