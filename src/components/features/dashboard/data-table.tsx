'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Task } from '@/payload-types'
import type { UserWithTasks } from '@/lib/types'
import { getStatusLabel } from '@/domain/constants/task-status.constants'
import { StudentDetailsModal } from '../student-details/student-details-modal'

export function DataTable({
  columns,
  data,
}: {
  // This receives the tasks array
  columns: Task[]
  // This receives the pupils array
  data: UserWithTasks[]
}) {
  const [selectedUser, setSelectedUser] = useState<UserWithTasks | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Update selectedUser when data changes (e.g. after router.refresh)
  useEffect(() => {
    if (selectedUser) {
      const updatedUser = data.find((u) => u.userId === selectedUser.userId)
      if (updatedUser) {
        setSelectedUser(updatedUser)
      }
    }
  }, [data, selectedUser])

  const handleRowClick = (user: UserWithTasks) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }
  // Transformiere die Daten: Jede Task-ID wird zu einer Eigenschaft mit dem Status als Wert
  const tableData = useMemo(
    () =>
      data.map((user, rowIndex) => {
        // Erstelle ein Objekt mit Task-IDs als Keys und Status als Values
        const taskStatusMap = user.tasks.reduce(
          (acc, task) => {
            acc[String(task.taskId)] = task.status
            return acc
          },
          {} as Record<string, string>,
        )

        return {
          id: user.userId,
          rowIndex,
          lastname: user.lastname,
          firstname: user.firstname,
          // Füge für jede Task-ID eine Eigenschaft hinzu (null, wenn kein Status vorhanden)
          ...columns.reduce(
            (acc, task) => {
              const status = taskStatusMap[String(task.id)] || null
              acc[String(task.id)] = status ? getStatusLabel(status) : null
              return acc
            },
            {} as Record<string, string | null>,
          ),
        }
      }),
    [data, columns],
  )

  return (
    <>
      <div className="table">
        <table cellPadding="0" cellSpacing="0">
          <thead>
            <tr>
              <th id="heading-lastname">Nachname</th>
              <th id="heading-firstname">Vorname</th>
              {columns.map((task) => (
                <th key={task.id} id={`heading-${String(task.id).replace(/\./g, '__')}`}>
                  {task.description}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row) => {
                const user = data.find((u) => u.userId === row.id)
                return (
                  <tr
                    key={row.id}
                    className={`row-${row.rowIndex + 1}`}
                    onClick={() => user && handleRowClick(user)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="cell-lastname">{row.lastname}</td>
                    <td className="cell-firstname">{row.firstname}</td>
                    {columns.map((task) => {
                      const taskId = String(task.id)
                      const rowData = row as Record<string, string | null | number>
                      const cellValue = rowData[taskId]
                      return (
                        <td key={task.id} className={`cell-${taskId.replace(/\./g, '__')}`}>
                          {typeof cellValue === 'string' ? cellValue : '-'}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: '2rem' }}>
                  Keine Daten vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <StudentDetailsModal
        tasks={columns}
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
