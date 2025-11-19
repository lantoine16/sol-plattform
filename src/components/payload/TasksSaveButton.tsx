'use client'

import React, { useState } from 'react'
import { useField, useDocumentInfo, toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { bulkCreateTasksAction } from '@/lib/actions/bulk-create-tasks'
import { SaveButton } from '@payloadcms/ui'
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

    if (!bulkCreateData || !subject) {
      const errorMessage = 'Bitte füllen Sie alle erforderlichen Felder aus (Aufgaben und Fach)'
      setError(errorMessage)
      toast.error(errorMessage)
      setIsLoading(false)
      return
    }

    try {
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

  // Wenn bulkCreateData vorhanden ist, zeige den Bulk-Create-Button
  if (isCreatePage) {
    const buttonClassName = [
      'btn',
      'btn--icon-style-without-border',
      'btn--size-medium',
      'btn--withoutPopup',
      'btn--style-primary',
      'btn--withoutPopup',
      isDisabled ? 'btn--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div>
        <button
          type="button"
          onClick={handleBulkCreate}
          disabled={isDisabled}
          className={buttonClassName}
        >
          {isLoading ? 'Speichere...' : 'Speichern'}
        </button>
        {error && (
          <div
            className="field-error"
            style={{ marginTop: '8px', color: 'var(--theme-error-500)' }}
          >
            {error}
          </div>
        )}
      </div>
    )
  }
  return <SaveButton />
}

export default TasksSaveButton
