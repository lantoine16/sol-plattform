'use client'

import React, { useState } from 'react'
import { useField, useDocumentInfo, toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { BulkSaveButton } from './BulkSaveButton'
import { bulkCreateTasksAction } from '@/lib/actions/bulk-create-tasks.actions'

export function TasksSaveButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { value: bulkCreateData } = useField<string>({ path: 'bulkCreateData' })
  const { value: subject } = useField<string | string[]>({ path: 'subject' })
  const { value: learningGroup } = useField<string[]>({ path: 'learningGroup' })
  const { value: user } = useField<string[]>({ path: 'user' })
  const { id } = useDocumentInfo()

  // Nur auf Create-Seite anzeigen (wenn keine ID vorhanden)
  const isCreatePage = !id
  const isDisabled = !isCreatePage || isLoading || !bulkCreateData || !subject

  const handleBulkCreate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!bulkCreateData || bulkCreateData.trim() === '') {
        throw new Error('Bitte geben Sie mindestens eine Aufgabe ein')
      }
      if (!subject) {
        throw new Error('Bitte wählen Sie ein Fach aus')
      }
      const createdTasks = await bulkCreateTasksAction({
        bulkData: bulkCreateData,
        subject: Array.isArray(subject) ? subject[0] : subject,
        learningGroup: learningGroup ?? null,
        user: user ?? null,
      })

      const amountOfCreatedTasks = createdTasks.length
      toast.success(
        amountOfCreatedTasks +
          (amountOfCreatedTasks === 1 ? ' Aufgabe wurde ' : ' Aufgaben wurden ') +
          'erfolgreich erstellt.',
      )
      router.push('/collections/tasks')
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler'
      setError(errorMessage)
      toast.error(errorMessage)
      setIsLoading(false)
    }
  }

  return (
    <BulkSaveButton
      isLoading={isLoading}
      error={error}
      isDisabled={isDisabled}
      onClick={handleBulkCreate}
      isCreatePage={isCreatePage}
    />
  )
}

export default TasksSaveButton
