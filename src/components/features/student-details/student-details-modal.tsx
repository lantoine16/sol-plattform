'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button, ReactSelectOption, Select } from '@payloadcms/ui'
import { X } from 'lucide-react'
import { UserTasksOverview } from './user-tasks-overview'
import { cn } from '@/lib/utils'
import type { LearningLocation, TaskProgress, User } from '@/payload-types'
import type { UserWithTaskProgress } from '@/lib/types'
import { updateUserLearningLocation } from '@/lib/actions/user.actions'
type StudentDetailsModalProps = {
  userWithTaskProgress: UserWithTaskProgress
  learningLocations: LearningLocation[]
  isOpen: boolean
  onClose: () => void
}

export function StudentDetailsModal({
  userWithTaskProgress,
  onClose,
  learningLocations,
}: StudentDetailsModalProps) {
  const [taskProgressEntries, setTaskProgressEntries] = useState<TaskProgress[]>(
    userWithTaskProgress.taskProgresses,
  )
  const [user, setUser] = useState<User>(userWithTaskProgress.user)
  const [isUpdatingLearningLocation, setIsUpdatingLearningLocation] = useState(false)

  // Update state when props change
  useEffect(() => {
    setTaskProgressEntries(userWithTaskProgress.taskProgresses)
    setUser(userWithTaskProgress.user)
  }, [userWithTaskProgress])

  const handleChangeLearningLocation = async (learningLocation: {
    value: string
    label: string
  }) => {
    console.log(user.graduation)
    setIsUpdatingLearningLocation(true)
    try {
      const result = await updateUserLearningLocation(user.id, learningLocation.value)
      if (result.success) {
        // Update local state optimistically
        const updatedLearningLocation =
          learningLocation.value &&
          learningLocations.find((loc) => loc.id === learningLocation.value)
            ? learningLocations.find((loc) => loc.id === learningLocation.value)!
            : null

        setUser((prevUser) => ({
          ...prevUser,
          currentLearningLocation: updatedLearningLocation || null,
        }))
      } else {
        console.error('Failed to update learning location:', result.error)
      }
    } catch (error) {
      console.error('Failed to update learning location:', error)
    } finally {
      setIsUpdatingLearningLocation(false)
    }
  }

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

  const currentLearningLocation =
    user.currentLearningLocation && typeof user.currentLearningLocation === 'object'
      ? {
          value: user.currentLearningLocation.id,
          label: user.currentLearningLocation.description ?? '',
        }
      : null
  const allowChangeLearningLocation =
    user.graduation && typeof user.graduation === 'object'
      ? user.graduation.canChangeLearningLocation
      : false

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
            <div className="flex flex-row items-center gap-5">
              <h1
                id="modal-title"
                className="text-2xl font-semibold text-gray-900 dark:text-gray-100"
              >
                {user.firstname} {user.lastname}
              </h1>

              {!allowChangeLearningLocation && currentLearningLocation ? (
                <div className="text-xl text-gray-600 dark:text-gray-400">
                  Lernort: {currentLearningLocation?.label}
                </div>
              ) : null}
              {allowChangeLearningLocation && (
                <Select
                  options={learningLocations.map((learningLocation) => ({
                    value: learningLocation.id,
                    label: learningLocation.description || '',
                  }))}
                  value={currentLearningLocation ? [currentLearningLocation] : undefined}
                  onChange={(value) => {
                    handleChangeLearningLocation(value as { value: string; label: string })
                  }}
                  disabled={isUpdatingLearningLocation}
                />
              )}
            </div>
            <Button buttonStyle="secondary" onClick={onClose} className="shrink-0 cursor-pointer">
              <X className="size-4 mr-1" />
              Schließen
            </Button>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
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
