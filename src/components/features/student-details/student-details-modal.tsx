'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@payloadcms/ui'
import { X } from 'lucide-react'
import { UserTasksOverview } from './user-tasks-overview'
import { cn } from '@/lib/utils'
import type { User, TaskProgress } from '@/payload-types'
import { getTaskProgressEntries } from '@/lib/actions/task-progress.actions'
type StudentDetailsModalProps = {
  user: User
  subjectIds: string[]
  isOpen: boolean
  onClose: () => void
}

export function StudentDetailsModal({
  user,
  subjectIds,
  isOpen,
  onClose,
}: StudentDetailsModalProps) {
  const [mounted, setMounted] = useState(false)
  const [taskProgressEntries, setTaskProgressEntries] = useState<TaskProgress[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (isOpen && user && subjectIds.length > 0) {
      setIsLoading(true)
      getTaskProgressEntries([user.id], subjectIds)
        .then((entries) => {
          setTaskProgressEntries(entries)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('Error loading task progress entries:', error)
          setIsLoading(false)
        })
    } else {
      // Reset data when modal is closed
      setTaskProgressEntries([])
      setIsLoading(false)
    }
  }, [isOpen, user?.id, subjectIds.join(',')])

  if (!isOpen || !user || !mounted) {
    return null
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
                {user.firstname} {user.lastname}
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
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-500 dark:text-gray-400">Lade Aufgaben...</p>
              </div>
            ) : (
              <UserTasksOverview userId={user.id} userTaskStatuses={taskProgressEntries} />
            )}
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}
