'use client'

import React, { useState } from 'react'
import { useField, useDocumentInfo, toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { BulkSaveButton } from './BulkSaveButton'
import { bulkCreateLearningLocationsAction } from '@/lib/actions/bulk-create-learning-locations.actions'

export function LearningLocationsSaveButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { value: bulkCreateData } = useField<string>({ path: 'bulkCreateData' })
  const { id } = useDocumentInfo()

  // Nur auf Create-Seite anzeigen (wenn keine ID vorhanden)
  const isCreatePage = !id
  const isDisabled = !isCreatePage || isLoading || !bulkCreateData

  const handleBulkCreate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!bulkCreateData || bulkCreateData.trim() === '') {
        throw new Error('Bitte geben Sie mindestens einen Lernort ein')
      }
      const createdLearningLocations = await bulkCreateLearningLocationsAction({
        bulkData: bulkCreateData,
      })

      const amountOfCreatedLearningLocations = createdLearningLocations.length
      toast.success(
        amountOfCreatedLearningLocations +
          (amountOfCreatedLearningLocations === 1 ? ' Lernort wurde ' : ' Lernorte wurden ') +
          'erfolgreich erstellt.',
      )
      router.push('/collections/learning-location')
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

export default LearningLocationsSaveButton

