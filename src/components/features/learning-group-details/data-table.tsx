'use client'

import { useEffect, useMemo, useState } from 'react'
import type { LearningLocation, Task } from '@/payload-types'
import type { UserWithTaskProgress } from '@/lib/types'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'
import { TaskBoardComponent } from '../task-board/task-board-component'
import { getSubjectColor } from '@/domain/constants/subject-color.constants'
import { useRouter } from 'next/navigation'
import { StatusIcon } from '../status-icon'
export function DataTable({
  columns,
  data,
  learningLocations,
}: {
  // This receives the tasks array (will be columns in the table)
  columns: Task[]
  // This receives the pupils array (will be rows in the table)
  data: UserWithTaskProgress[]
  learningLocations: LearningLocation[]
}) {
  const [selectedUser, setSelectedUser] = useState<UserWithTaskProgress | null>(null)

  const router = useRouter()

  // Update selectedUser when data changes (e.g. after router.refresh)
  useEffect(() => {
    if (selectedUser) {
      const updatedUser = data.find((u) => u.user.id === selectedUser.user.id)
      if (updatedUser) {
        setSelectedUser(updatedUser)
      }
    }
  }, [data, selectedUser])

  const handleRowClick = (user: UserWithTaskProgress) => {
    setSelectedUser(user)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
    router.refresh()
  }

  // Erstelle eine Map für schnellen Zugriff: userId -> taskId -> status
  const userTaskStatusMap = useMemo(() => {
    const map = new Map<string, Map<string, { status: TaskStatusValue; helpNeeded: boolean }>>()

    data.forEach((user) => {
      const taskMap = new Map<string, { status: TaskStatusValue; helpNeeded: boolean }>()
      user.taskProgresses.forEach((taskProgress) => {
        taskMap.set(
          String(typeof taskProgress.task === 'object' ? taskProgress.task?.id : taskProgress.task),
          {
            status: taskProgress.status,
            helpNeeded: taskProgress.helpNeeded || false,
          },
        )
      })
      map.set(user.user.id, taskMap)
    })

    return map
  }, [data])

  // Hole Status für eine bestimmte Aufgabe × Schüler Kombination
  const getTaskStatusForUser = (taskId: string, userId: string) => {
    const userMap = userTaskStatusMap.get(userId)
    if (!userMap) return null
    return userMap.get(String(taskId)) || null
  }

  // Extrahiere Subject-Color aus einem Task
  const getSubjectColorFromTask = (task: Task): string | null => {
    if (!task.subject) return null

    // Subject kann ein String (ID) oder ein Subject-Objekt sein
    const subject = typeof task.subject === 'string' ? null : task.subject

    if (!subject || !subject.color) return null

    // Color ist als String-Wert gespeichert (z.B. 'blue', 'green')
    return getSubjectColor(subject.color, true)
  }

  return (
    <>
      <div id="learning-group-details-table" className="table__wrap text-sm">
        <table className="table w-full">
          <thead className="table__header">
            <tr className="table__row">
              <th className="table__header-cell min-w-fit ">
                <span className="field-label unstyled">Vorname</span>
              </th>
              <th className="table__header-cell min-w-fit ">
                <span className="field-label unstyled">Nachname</span>
              </th>
              {columns.map((task) => {
                const backgroundColor = getSubjectColorFromTask(task)
                return (
                  <th
                    key={task.id}
                    className="table__header-cell min-w-fit  text-center"
                    style={{
                      color: backgroundColor || 'black',
                    }}
                    title={task.title || ''}
                  >
                    {task.title || ''}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="table__body">
            {data.length > 0 ? (
              data.map((userWithTask) => {
                return (
                  <tr
                    key={userWithTask.user.id}
                    className="table__row cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => handleRowClick(userWithTask)}
                  >
                    <td className="table__cell min-w-fit">{userWithTask.user.firstname || ''}</td>
                    <td className="table__cell min-w-fit">{userWithTask.user.lastname || ''}</td>
                    {columns.map((task) => {
                      const taskId = String(task.id)
                      const taskStatus = getTaskStatusForUser(taskId, userWithTask.user.id)
                      return (
                        <td key={task.id} className="table__cell min-w-fit text-center">
                          {taskStatus ? (
                            <StatusIcon status={taskStatus.status} className="mx-auto" />
                          ) : (
                            <StatusIcon status={null} className="mx-auto" />
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="table__cell text-center p-4 text-sm text-muted-foreground"
                >
                  Keine Daten vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <TaskBoardComponent
          userWithTaskProgress={selectedUser}
          learningLocations={learningLocations}
          showAsModal={true}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
