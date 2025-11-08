'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

type SearchParamsCleanupProps = {
  userIdParamValue: string | undefined
  availableUserIds: string[]
  userSearchParamName: string
}

/**
 * Client-Komponente, die automatisch den user Search-Parameter entfernt,
 * wenn der ausgewählte Schüler nicht mehr in der Liste verfügbar ist.
 * Dies verhindert einen Server-seitigen Redirect und bietet eine bessere UX.
 */
export function SearchParamsCleanup({
  userIdParamValue,
  availableUserIds,
  userSearchParamName,
}: SearchParamsCleanupProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Prüfe, ob ein user Parameter vorhanden ist, aber der Schüler nicht mehr verfügbar ist
    if (
      userIdParamValue &&
      userIdParamValue !== '0' &&
      !availableUserIds.includes(userIdParamValue)
    ) {
      // Erstelle neue Search-Params ohne den user Parameter
      const params = new URLSearchParams(searchParams)
      params.delete(userSearchParamName)

      // Client-seitige Navigation ohne Reload
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [userIdParamValue, availableUserIds, userSearchParamName, searchParams, pathname, router])

  return null // Diese Komponente rendert nichts
}

