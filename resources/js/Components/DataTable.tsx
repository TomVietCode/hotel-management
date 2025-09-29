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
}

export default function DataTable<T>({
  columns,
  data,
  onRowClick
}: DataTableProps<T>) {
  return (
    <div>table</div>
  )
}