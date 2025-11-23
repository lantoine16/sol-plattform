'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import type { Task } from '@/payload-types'
import type { UserWithTasks } from '@/lib/types'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'
import { StudentDetailsModal } from '../student-details/student-details-modal'
import { StatusIcon } from './status-icon'
import { cn } from '@/lib/utils'
import { getSubjectColor } from '@/domain/constants/subject-color.constants'

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
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Warte auf Mount, um Hydration-Mismatch zu vermeiden
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = mounted && (resolvedTheme === 'dark' || theme === 'dark')

  // Update selectedUser when data changes (e.g. after router.refresh)
  useEffect(() => {
    if (selectedUser) {
      const updatedUser = data.find((u) => u.userId === selectedUser.userId)
      if (updatedUser) {
        setSelectedUser(updatedUser)
      }
    }
  }, [data, selectedUser])

  const handleColumnClick = (user: UserWithTasks) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  // Erstelle eine Map für schnellen Zugriff: userId -> taskId -> status
  const userTaskStatusMap = useMemo(() => {
    const map = new Map<string, Map<string, { status: TaskStatusValue; helpNeeded: boolean }>>()

    data.forEach((user) => {
      const taskMap = new Map<string, { status: TaskStatusValue; helpNeeded: boolean }>()
      user.tasks.forEach((task) => {
        taskMap.set(String(task.taskId), {
          status: task.status,
          helpNeeded: task.helpNeeded || false,
        })
      })
      map.set(user.userId, taskMap)
    })

    return map
  }, [data])

  // Kompakte Namensdarstellung für Schüler: "Vorname + erster Buchstabe des Nachnamens"
  const getCompactName = (user: UserWithTasks) => {
    const lastNameInitial = user.lastname?.charAt(0).toUpperCase() || ''
    const fullName = `${user.firstname || ''} ${lastNameInitial}.`.trim()
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
                {data.map((user) => {
                  const compactName = getCompactName(user)
                  return (
                    <th
                      key={user.userId}
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
                      title={`${user.lastname}, ${user.firstname}`}
                      onClick={() => handleColumnClick(user)}
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
                  const shortDescription = getShortTaskDescription(task.description)
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
                        title={task.description || ''}
                      >
                        {shortDescription}
                      </td>
                      {data.map((user) => {
                        const taskStatus = getTaskStatusForUser(taskId, user.userId)
                        return (
                          <td
                            key={user.userId}
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
      <StudentDetailsModal
        tasks={columns}
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
