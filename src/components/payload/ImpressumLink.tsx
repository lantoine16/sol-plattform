'use client'

import React from 'react'

export const ImpressumLink = () => {
  // WICHTIG: In Client-Komponenten müssen Umgebungsvariablen mit NEXT_PUBLIC_ beginnen
  const impressumUrl = process.env.NEXT_PUBLIC_IMPRESSUM_URL

  return (
    <div className="text-center">
      {/* noopener: Verhindert Tabnabbing-Angriffe, noreferrer: Verhindert Referrer-Weitergabe (Sicherheit & Datenschutz) */}
      <a
        href={impressumUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-600 no-underline hover:underline"
      >
        Impressum
      </a>
    </div>
  )
}

export default ImpressumLink
