'use client'

import { useEffect } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

/**
 * Komponente die Auth-Felder im Create-Modus ausblendet
 * Wird als UI-Feld in der Collection verwendet
 */
export const HideAuthFieldsOnCreate: React.FC = () => {
  const { id } = useDocumentInfo()

  useEffect(() => {
    // Nur im Create-Modus (wenn keine ID vorhanden)
    if (!id) {
      // Verstecke den gesamten Auth-Felder-Container mit CSS
      const style = document.createElement('style')
      style.textContent = `
        .auth-fields.collection-edit__auth
        {
          display: none !important;
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [id])

  return null
}

export default HideAuthFieldsOnCreate
