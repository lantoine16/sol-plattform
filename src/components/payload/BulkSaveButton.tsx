'use client'

import React from 'react'
import { SaveButton } from '@payloadcms/ui'

type BulkSaveButtonProps = {
  isLoading: boolean
  error: string | null
  isDisabled: boolean
  onClick: () => void
  isCreatePage: boolean
}

export function BulkSaveButton({
  isLoading,
  error,
  isDisabled,
  onClick,
  isCreatePage,
}: BulkSaveButtonProps) {
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
        <button type="button" onClick={onClick} disabled={isDisabled} className={buttonClassName}>
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

export default BulkSaveButton
