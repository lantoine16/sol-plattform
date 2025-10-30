'use client'

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Task } from '@/payload-types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TPupil extends { firstname: string; lastname: string }> {
  // This receives the tasks array (from filteredTasks.docs)
  columns: Task[]
  // This receives the pupils array (from filteredUsers.docs)
  data: TPupil[]
}

export function DataTable<TPupil extends { firstname: string; lastname: string }>({
  columns,
  data,
}: DataTableProps<TPupil>) {
  // Build table columns: Nachname, Vorname, then one column per task
  const builtColumns: ColumnDef<TPupil>[] = [
    {
      accessorKey: 'lastname',
      header: 'Nachname',
    },
    {
      accessorKey: 'firstname',
      header: 'Vorname',
    },
    ...columns.map(
      (task: Task): ColumnDef<TPupil> => ({
        id: `task-${String((task as any)?.id ?? (task as any)?._id ?? '')}`,
        header: String((task as any)?.description ?? (task as any)?.name ?? 'Aufgabe'),
        // Cells intentionally empty for now
        cell: () => null,
      }),
    ),
  ]

  const table = useReactTable({
    data,
    columns: builtColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
