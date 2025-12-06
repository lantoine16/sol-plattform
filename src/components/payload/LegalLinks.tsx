'use client'

import Link from 'next/link'
import React from 'react'

export const LegalLinks = () => {
  // WICHTIG: In Client-Komponenten müssen Umgebungsvariablen mit NEXT_PUBLIC_ beginnen
  const impressumUrl = process.env.NEXT_PUBLIC_IMPRESSUM_URL
  const datenschutzUrl = '/datenschutz'

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        {/* noopener: Verhindert Tabnabbing-Angriffe, noreferrer: Verhindert Referrer-Weitergabe (Sicherheit & Datenschutz) */}
        <a
          href={impressumUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 no-underline hover:text-gray-800 hover:underline transition-colors"
        >
          Impressum
        </a>
        <span className="text-gray-400">|</span>
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
