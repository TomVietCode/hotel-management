import React from "react"

export interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (row: T) => void
  actionButton?: (row: T) => React.ReactNode
}

export default function DataTable<T>({
  columns,
  data,
  onRowClick,
  actionButton
}: DataTableProps<T>) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left">
        {/* Table header */}
        <thead className="bg-gray-200 text-gray-700">
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
            <tr key={rowIndex} className="bg-gray-50 border-b cursor-pointer hover:bg-gray-100">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`px-6 py-4 ${column.className || ""}`}>
                  {typeof column.accessor === 'function'
                    ? column.accessor(row)
                    : String(row[column.accessor as keyof T] ?? '')}
                </td>
              ))}
              {actionButton && <td className="px-6 py-4">{actionButton(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}