'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import type { LearningLocation, Task } from '@/payload-types'
import type { UserWithTaskProgress } from '@/lib/types'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'
import { TaskBoardComponent } from '../task-board/task-board-component'
import { StatusIcon } from './status-icon'
import { getSubjectColor } from '@/domain/constants/subject-color.constants'
import { useRouter } from 'next/navigation'
export function DataTable({
  columns,
  data,
  learningLocations,
}: {
  // This receives the tasks array
  columns: Task[]
  // This receives the pupils array
  data: UserWithTaskProgress[]
  learningLocations: LearningLocation[]
}) {
  const [selectedUser, setSelectedUser] = useState<UserWithTaskProgress | null>(null)
  const { theme, resolvedTheme } = useTheme()

  const router = useRouter()

  const isDarkMode = resolvedTheme === 'dark' || theme === 'dark'

  // Update selectedUser when data changes (e.g. after router.refresh)
  useEffect(() => {
    if (selectedUser) {
      const updatedUser = data.find((u) => u.user.id === selectedUser.user.id)
      if (updatedUser) {
        setSelectedUser(updatedUser)
      }
    }
  }, [data, selectedUser])

  const handleColumnClick = (user: UserWithTaskProgress) => {
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

  // Kompakte Namensdarstellung für Schüler: "Vorname + erster Buchstabe des Nachnamens"
  const getCompactName = (userWithTask: UserWithTaskProgress) => {
    const lastNameInitial = userWithTask.user.lastname?.charAt(0).toUpperCase() || ''
    const fullName = `${userWithTask.user.firstname || ''} ${lastNameInitial}.`.trim()
    // Maximal 14 Zeichen, sonst mit ... abkürzen
    if (fullName.length > 14) {
      return fullName.substring(0, 11) + '...'
    }
    return fullName
  }

  // Kürze Task-Beschreibungen für kompakte Darstellung
  const getShortTaskDescription = (description: string | null | undefined, maxLength = 15) => {
    if (!description) return ''
    return description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description
  }

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
    return getSubjectColor(subject.color, isDarkMode)
  }

  return (
    <>
      <div className="w-full overflow-auto max-h-[calc(100vh-200px)]">
        <div className="inline-block min-w-full">
          <table
            cellPadding="0"
            cellSpacing="0"
            className="border-collapse w-full"
            style={{ tableLayout: 'auto' }}
          >
            <thead className="sticky top-0 z-10 bg-background">
              <tr>
                <th
                  className="sticky left-0 z-20 bg-background border-r border-b p-1 text-left font-semibold text-[10px] leading-tight"
                  style={{
                    width: '70px',
                    minWidth: '70px',
                    maxWidth: '70px',
                  }}
                >
                  Aufgabe
                </th>
                {data.map((userWithTask) => {
                  const compactName = getCompactName(userWithTask)
                  return (
                    <th
                      key={userWithTask.user.id}
                      className="border-b border-r p-1 font-semibold text-[10px] leading-tight hover:bg-accent/50 transition-colors cursor-pointer"
                      style={{
                        minWidth: '28px',
                        width: 'auto',
                        height: '60px',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        verticalAlign: 'bottom',
                        position: 'relative',
                      }}
                      title={`${userWithTask.user.lastname || ''}, useEffect${userWithTask.user.firstname || ''}`}
                      onClick={() => handleColumnClick(userWithTask)}
                    >
                      <div
                        className="whitespace-nowrap"
                        style={{
                          position: 'absolute',
                          bottom: '4px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                        }}
                      >
                        {compactName}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {columns.length > 0 ? (
                columns.map((task) => {
                  const taskId = String(task.id)
                  const shortDescription = getShortTaskDescription(task.title)
                  const backgroundColor = getSubjectColorFromTask(task)

                  return (
                    <tr
                      key={task.id}
                      style={{
                        height: '28px',
                        backgroundColor: backgroundColor || undefined,
                      }}
                    >
                      <td
                        className="sticky left-0 z-10 border-r border-b p-1 text-[10px] leading-none"
                        style={{
                          width: '70px',
                          minWidth: '70px',
                          maxWidth: '70px',
                          backgroundColor: backgroundColor || undefined,
                        }}
                        title={task.title || ''}
                      >
                        {shortDescription}
                      </td>
                      {data.map((userWithTask) => {
                        const taskStatus = getTaskStatusForUser(taskId, userWithTask.user.id)
                        return (
                          <td
                            key={userWithTask.user.id}
                            className="border-r border-b p-0 text-center align-middle"
                            style={{
                              minWidth: '28px',
                              width: 'auto',
                              height: '28px',
                              padding: '2px',
                              backgroundColor: backgroundColor || undefined,
                            }}
                          >
                            {taskStatus ? (
                              <StatusIcon
                                status={taskStatus.status}
                                helpNeeded={taskStatus.helpNeeded}
                                className="mx-auto"
                              />
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
                    colSpan={data.length + 1}
                    className="text-center p-4 text-sm text-muted-foreground"
                  >
                    Keine Daten vorhanden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
