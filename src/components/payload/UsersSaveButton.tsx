'use client'

import React, { useState } from 'react'
import { useField, useDocumentInfo, toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { bulkCreateUsersAction } from '@/lib/actions/bulk-create-users.actions'
import { BulkSaveButton } from './BulkSaveButton'
import type { UserRoleValue } from '@/domain/constants/user-role.constants'
import type { UserGraduationValue } from '@/domain/constants/user-graduation.constants'

export function UsersSaveButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { value: bulkCreateData } = useField<string>({ path: 'bulkCreateData' })
  const { value: learningGroup } = useField<string[] | null>({ path: 'learningGroup' })
  const { value: learningLocation } = useField<string | null>({ path: 'learningLocation' })
  const { value: role } = useField<UserRoleValue>({ path: 'role' })
  const { value: graduation } = useField<UserGraduationValue>({ path: 'graduation' })
  const { id } = useDocumentInfo()

  const isCreatePage = !id
  const isDisabled = !isCreatePage || isLoading || !bulkCreateData || !role

  const handleBulkCreate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (!bulkCreateData || bulkCreateData.trim() === '') {
        throw new Error('Bitte geben Sie Benutzerdaten ein.')
      }
      if (!role) {
        throw new Error('Bitte wählen Sie eine Rolle aus.')
      }
      const createdUsers = await bulkCreateUsersAction({
        bulkData: bulkCreateData,
        learningGroup: learningGroup,
        learningLocation: learningLocation,
        role: role,
        graduation: graduation,
      })
      const amountOfCreatedUsers = createdUsers.length
      toast.success(
        amountOfCreatedUsers +
          (amountOfCreatedUsers === 1 ? ' Benutzer wurde ' : ' Benutzer wurden ') +
          'erfolgreich erstellt.',
      )
      router.push('/collections/users')
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

export default UsersSaveButton
