'use client'

import type { UserWithTasks } from '@/lib/types'
import type { Task } from '@/payload-types'
import { Button } from '@payloadcms/ui'
import { UserTasksOverview } from './user-tasks-overview'

type StudentDetailsModalProps = {
  tasks: Task[]
  user: UserWithTasks | null
  isOpen: boolean
  onClose: () => void
}

export function StudentDetailsModal({ tasks, user, isOpen, onClose }: StudentDetailsModalProps) {
  if (!isOpen || !user) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '90%',
          width: '1200px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Schüler Details</h1>
            <p>
              <strong>Name:</strong> {user.firstname} {user.lastname}
            </p>
          </div>
          <Button buttonStyle="secondary" onClick={onClose}>
            Schließen
          </Button>
        </div>

        <UserTasksOverview userId={user.userId} tasks={tasks} userTaskStatuses={user.tasks} />
      </div>
    </div>
  )
}
