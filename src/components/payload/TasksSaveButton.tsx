'use client'

import React, { useState, useMemo } from 'react'
import { useField, useDocumentInfo, toast, useFormFields } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { BulkSaveButton } from './BulkSaveButton'
import { blockCreateTasksAction } from '@/lib/actions/bulk-create-tasks.actions'

export function TasksSaveButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Try using useFormFields to get all fields - this should give us access to all form data
  const allFields = useFormFields(([fields]) => {
    // Return the entire fields object so we can access taskBlocks
    return fields
  })

  const taskBlocks = useMemo(() => {
    if (!allFields || !allFields.taskBlocks) {
      return []
    }

    const blocks: Array<{
      title: string
      description?: string
    }> = []

    // Get the number of blocks
    const blockCount = (allFields.taskBlocks.value as number) || 0

    // Extract each block
    for (let i = 0; i < blockCount; i++) {
      const titleField = allFields[`taskBlocks.${i}.title`] as { value?: string } | undefined
      const descField = allFields[`taskBlocks.${i}.description`] as { value?: string } | undefined

      const title = titleField?.value?.trim() || ''
      const description = descField?.value?.trim() || ''

      // Only add blocks that have a title
      if (title) {
        blocks.push({
          title,
          description: description || undefined,
        })
      }
    }

    return blocks
  }, [allFields]) // Re-compute automatically when allFields changes
  const { value: subject } = useField<string | string[]>({ path: 'subject' })
  const { value: learningGroup } = useField<string[]>({ path: 'learningGroup' })
  const { value: user } = useField<string[]>({ path: 'user' })
  const { id } = useDocumentInfo()

  // Nur auf Create-Seite anzeigen (wenn keine ID vorhanden)
  const isCreatePage = !id
  const hasValidBlocks =
    taskBlocks && taskBlocks.length > 0
  const isDisabled = !isCreatePage || isLoading || !hasValidBlocks || !subject

  const handleBlockCreate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Use the memoized taskBlocks
      if (!taskBlocks || taskBlocks.length === 0) {
        throw new Error('Bitte fügen Sie mindestens einen Aufgaben-Block hinzu')
      }

      if (!subject) {
        throw new Error('Bitte wählen Sie ein Fach aus')
      }

      const createdTasks = await blockCreateTasksAction({
        blocks: taskBlocks,
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
      onClick={handleBlockCreate}
      isCreatePage={isCreatePage}
      isDisabled={isDisabled}
    />
  )
}

export default TasksSaveButton
