'use client'

import { useMemo } from 'react'
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
import { UserWithTasks } from './types'
import { getStatusLabel } from '@/collections/task-progress'

export function DataTable<TableData>({
  columns,
  data,
}: {
  // This receives the tasks array (from filteredTasks.docs)
  columns: Task[]
  // This receives the pupils array (from filteredUsers.docs)
  data: UserWithTasks[]
}) {
  // Build table columns: Nachname, Vorname, then one column per task
  const builtColumns: ColumnDef<TableData>[] = useMemo(
    () => [
      {
        accessorKey: 'lastname',
        header: 'Nachname',
      },
      {
        accessorKey: 'firstname',
        header: 'Vorname',
      },
      ...columns.map(
        (task: Task): ColumnDef<TableData> => ({
          accessorKey: String(task.id),
          header: task.description,
          cell: ({ getValue }) => {
            const status = getValue() as string | null
            return getStatusLabel(status) // Zeige Label statt Wert
          },
        }),
      ),
    ],
    [columns],
  )

  // Transformiere die Daten: Jede Task-ID wird zu einer Eigenschaft mit dem Status als Wert
  const tableData = useMemo(
    () =>
      data.map((user) => {
        // Erstelle ein Objekt mit Task-IDs als Keys und Status als Values
        const taskStatusMap = user.tasks.reduce(
          (acc, task) => {
            acc[String(task.task_id)] = task.status
            return acc
          },
          {} as Record<string, string>,
        )

        return {
          lastname: user.lastname,
          firstname: user.firstname,
          // Füge für jede Task-ID eine Eigenschaft hinzu (undefined, wenn kein Status vorhanden)
          ...columns.reduce(
            (acc, task) => {
              acc[String(task.id)] = taskStatusMap[String(task.id)] || null
              return acc
            },
            {} as Record<string, string | null>,
          ),
        }
      }),
    [data, columns],
  )

  const table = useReactTable({
    data: tableData as TableData[],
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
              <TableCell colSpan={builtColumns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
