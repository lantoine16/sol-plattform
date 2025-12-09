'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export const LegalLinks = () => {
  const [impressumUrl, setImpressumUrl] = useState<string>('')
  const datenschutzUrl = '/datenschutz'

  // Lade Impressum-URL zur Laufzeit über API-Route
  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((data) => {
        if (data.impressumUrl) {
          setImpressumUrl(data.impressumUrl)
        }
      })
      .catch(() => {
        // Fallback auf NEXT_PUBLIC_ Variable, falls API nicht verfügbar
        const fallbackUrl = process.env.NEXT_PUBLIC_IMPRESSUM_URL
        if (fallbackUrl) {
          setImpressumUrl(fallbackUrl)
        }
      })
  }, [])

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        {/* noopener: Verhindert Tabnabbing-Angriffe, noreferrer: Verhindert Referrer-Weitergabe (Sicherheit & Datenschutz) */}
        {impressumUrl && (
          <>
            <a
              href={impressumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 no-underline hover:text-gray-800 hover:underline transition-colors"
            >
              Impressum
            </a>
            <span className="text-gray-400">|</span>
          </>
        )}
        <Link
          href={datenschutzUrl}
          className="text-gray-600 no-underline hover:text-gray-800 hover:underline transition-colors"
        >
          Datenschutz
        </Link>
      </div>
    </div>
  )
}

export default LegalLinks
