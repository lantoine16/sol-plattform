'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@payloadcms/ui'
import { X } from 'lucide-react'
import { UserTasksOverview } from './user-tasks-overview'
import { cn } from '@/lib/utils'
import type { User, TaskProgress } from '@/payload-types'
import { getTaskProgressEntries } from '@/lib/actions/task-progress.actions'
import type { UserWithTaskProgress } from '@/lib/types'
type StudentDetailsModalProps = {
  userWithTaskProgress: UserWithTaskProgress
  isOpen: boolean
  onClose: () => void
}

export function StudentDetailsModal({
  userWithTaskProgress,
  onClose,
}: StudentDetailsModalProps) {
  const [taskProgressEntries, setTaskProgressEntries] = useState<TaskProgress[]>(userWithTaskProgress.taskProgresses)


  const handleTaskProgressUpdate = async (
    taskId: string,
    status: 'not-started' | 'in-progress' | 'finished',
  ) => {
    // Optimistically update the local state
    setTaskProgressEntries((prevEntries) => {
      const entryIndex = prevEntries.findIndex((entry) => {
        const entryTaskId = typeof entry.task === 'string' ? entry.task : entry.task.id
        return entryTaskId === taskId
      })

      if (entryIndex === -1) {
        return prevEntries
      }

      const updatedEntries = [...prevEntries]
      updatedEntries[entryIndex] = {
        ...updatedEntries[entryIndex],
        status,
      }

      return updatedEntries
    })
  }

  const handleHelpNeededUpdate = (taskId: string, helpNeeded: boolean) => {
    // Optimistically update the local state
    setTaskProgressEntries((prevEntries) => {
      const entryIndex = prevEntries.findIndex((entry) => {
        const entryTaskId = typeof entry.task === 'string' ? entry.task : entry.task.id
        return entryTaskId === taskId
      })

      if (entryIndex === -1) {
        return prevEntries
      }

      const updatedEntries = [...prevEntries]
      updatedEntries[entryIndex] = {
        ...updatedEntries[entryIndex],
        helpNeeded,
      }

      return updatedEntries
    })
  }

  const handleSearchPartnerUpdate = (taskId: string, searchPartner: boolean) => {
    // Optimistically update the local state
    setTaskProgressEntries((prevEntries) => {
      const entryIndex = prevEntries.findIndex((entry) => {
        const entryTaskId = typeof entry.task === 'string' ? entry.task : entry.task.id
        return entryTaskId === taskId
      })

      if (entryIndex === -1) {
        return prevEntries
      }

      const updatedEntries = [...prevEntries]
      updatedEntries[entryIndex] = {
        ...updatedEntries[entryIndex],
        searchPartner,
      }

      return updatedEntries
    })
  }

  const modalContent = (
    <>
      {/* Overlay - nur Hintergrund */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal Content */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
        onClick={(e) => {
          // Schließe nur, wenn direkt auf den Container geklickt wird (nicht auf den Modal-Content)
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <div
          className={cn(
            'relative flex flex-col',
            'bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl',
            'w-full max-w-[1200px] max-h-[90vh]',
            'mx-4 my-4',
            'overflow-hidden',
            'pointer-events-auto',
          )}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-1">
              <h1
                id="modal-title"
                className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
              >
                {userWithTaskProgress.user.firstname} {userWithTaskProgress.user.lastname}
              </h1>
            </div>
            <Button buttonStyle="secondary" onClick={onClose} className="shrink-0 cursor-pointer">
              <X className="size-4" />
              Schließen
            </Button>
          </div>

          {/* Content */}
          <div
            className="flex-1 overflow-y-auto px-6 py-4"
          >
              <UserTasksOverview
                userId={userWithTaskProgress.user.id}
                userTaskStatuses={taskProgressEntries}
                onTaskProgressUpdate={handleTaskProgressUpdate}
                onHelpNeededUpdate={handleHelpNeededUpdate}
                onSearchPartnerUpdate={handleSearchPartnerUpdate}
              />
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}
