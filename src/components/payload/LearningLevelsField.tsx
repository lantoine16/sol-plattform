'use client'

import { RelationshipField, useDocumentInfo } from '@payloadcms/ui'
import type { RelationshipFieldClientComponent } from 'payload'

/**
 * Custom Wrapper für das LearningLevels-Feld.
 * Versteckt das Feld auf der Create-Seite, zeigt es aber beim Bearbeiten und in der Gruppenbearbeitung (Bulk Edit).
 * Ohne condition, damit Payload das Feld im Bulk Edit korrekt editierbar macht.
 * TODO: Workaround sobald es schönere Option von Payload gibt diese Nutzen, Stand (23.3.2026) keine schöner Lösung gefunden
 */
export const LearningLevelsField: RelationshipFieldClientComponent = (props) => {
  const { id } = useDocumentInfo()

  // Einzelbearbeitung: immer anzeigen
  if (id) {
    return <RelationshipField {...props} />
  }

  // Kein ID: Create-Seite oder Bulk Edit
  if (typeof window !== 'undefined' && window.location.pathname.endsWith('/create')) {
    return null
  }

  // Bulk Edit oder anderer Kontext: anzeigen
  return <RelationshipField {...props} />
}

export default LearningLevelsField
