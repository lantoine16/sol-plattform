'use client'

import { useEffect, useMemo, useState } from 'react'
import type { LearningLocation, Task } from '@/payload-types'
import type { UserWithTaskProgress } from '@/lib/types'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'
import { TaskBoardComponent } from '../task-board/task-board-component'
import { getSubjectColor } from '@/domain/constants/subject-color.constants'
import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
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
    const map = new Map<
      string,
      Map<string, { status: TaskStatusValue; helpNeeded: boolean; searchPartner: boolean }>
    >()

    data.forEach((user) => {
      const taskMap = new Map<
        string,
        { status: TaskStatusValue; helpNeeded: boolean; searchPartner: boolean }
      >()
      user.taskProgresses.forEach((taskProgress) => {
        taskMap.set(
          String(typeof taskProgress.task === 'object' ? taskProgress.task?.id : taskProgress.task),
          {
            status: taskProgress.status,
            helpNeeded: taskProgress.helpNeeded || false,
            searchPartner: taskProgress.searchPartner || false,
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
      <div
        id="learning-group-details-table"
        className="table__wrap text-sm overflow-x-auto overflow-y-auto h-full max-w-full"
      >
        <table className="table w-full">
          <thead className="table__header sticky top-0 z-10">
            <tr className="table__row">
              <th
                className="table__header-cell min-w-fit sticky left-0 z-20"
                style={{
                  backgroundColor: 'var(--theme-elevation-0)',
                }}
              >
                <span className="field-label unstyled">Vorname</span>
              </th>
              <th
                className="table__header-cell min-w-fit sticky left-0 z-20"
                style={{
                  backgroundColor: 'var(--theme-elevation-0)',
                }}
              >
                <span className="field-label unstyled">Nachname</span>
              </th>
              {columns.map((task) => {
                const backgroundColor = getSubjectColorFromTask(task)
                return (
                  <th
                    key={task.id}
                    className="table__header-cell min-w-fit text-center"
                    style={{
                      color: backgroundColor || 'black',
                      backgroundColor: 'var(--theme-elevation-0)',
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
                      const subjectColor = getSubjectColorFromTask(task)
                      const status = taskStatus?.status || null
                      const helpNeeded = taskStatus?.helpNeeded || false
                      const searchPartner = taskStatus?.searchPartner || false

                      // Bestimme die Darstellung basierend auf dem Status
                      let cellContent = null
                      if (status === 'in-progress' && subjectColor) {
                        // Dreieck (Hälfte des Rechtecks) mit Fachfarbe - von oben links
                        cellContent = (
                          <div
                            style={{
                              backgroundColor: subjectColor,
                              clipPath: 'polygon(0 0, 0 100%, 100% 0)',
                            }}
                            className="w-full h-full"
                          />
                        )
                      } else if (status === 'finished' && subjectColor) {
                        // Vollständig gefüllt mit Fachfarbe
                        cellContent = (
                          <div
                            style={{
                              backgroundColor: subjectColor,
                            }}
                            className="w-full h-full"
                          />
                        )
                      }
                      // Wenn status null oder 'not-started', bleibt cellContent null (leer)

                      return (
                        <td
                          key={task.id}
                          className="table__cell min-w-fit text-center p-1 h-10 relative"
                        >
                          {cellContent}
                          {(helpNeeded || searchPartner) && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
                              {helpNeeded && (
                                <span className=" font-bold text-5xl leading-none ">?</span>
                              )}
                              {searchPartner && (
                                <Users
                                  className="mt-2 h-8 w-8"
                                  strokeWidth={3}
                                  style={{ fill: 'currentColor' }}
                                />
                              )}
                            </div>
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
