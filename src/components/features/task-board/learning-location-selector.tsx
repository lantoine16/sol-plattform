'use client'

import { Select } from '@payloadcms/ui'
import type { LearningLocation } from '@/payload-types'
import { useState } from 'react'
import { updateUserLearningLocation } from '@/lib/actions/user.actions'
type LearningLocationSelectorProps = {
  allowChangeLearningLocation: boolean
  currentLearningLocation: { value: string; label: string } | null
  learningLocations: LearningLocation[]
  userId: string
  afterChangeSuccess?: (learningLocationId: string) => void
}

export function LearningLocationSelector({
  allowChangeLearningLocation,
  currentLearningLocation,
  learningLocations,
  userId,
  afterChangeSuccess,
}: LearningLocationSelectorProps) {
  const [isUpdatingLearningLocation, setIsUpdatingLearningLocation] = useState(false)
  const [currentLearningLocationState, setCurrentLearningLocationState] = useState<{
    value: string
    label: string
  } | null>(currentLearningLocation)
  const handleChangeLearningLocation = async (learningLocation: {
    value: string
    label: string
  }) => {
    setIsUpdatingLearningLocation(true)
    try {
      const result = await updateUserLearningLocation(userId, learningLocation.value)
      if (result.success) {
        setCurrentLearningLocationState(learningLocation)
        afterChangeSuccess?.(learningLocation.value)
      } else {
        console.error('Failed to update learning location:', result.error)
      }
    } catch (error) {
      console.error('Failed to update learning location:', error)
    } finally {
      setIsUpdatingLearningLocation(false)
    }
  }

  if (!allowChangeLearningLocation && currentLearningLocation) {
    return (
      <div className="text-2xl text-gray-900 dark:text-gray-100">
        Mein Lernort: {currentLearningLocation?.label}
      </div>
    )
  }
  if (allowChangeLearningLocation) {
    return (
      <div className="flex flex-row items-center gap-2">
        <label htmlFor="learningLocation" className="text-2xl text-gray-900 dark:text-gray-100">
          Mein Lernort:
        </label>
        <Select
          className="min-w-[200px]"
          options={learningLocations.map((learningLocation) => ({
            value: learningLocation.id,
            label: learningLocation.description || '',
          }))}
          value={currentLearningLocationState ? [currentLearningLocationState] : undefined}
          onChange={(value) =>
            handleChangeLearningLocation(value as { value: string; label: string })
          }
          disabled={isUpdatingLearningLocation}
          isClearable={false}
        />
      </div>
    )
  }

  return null
}
