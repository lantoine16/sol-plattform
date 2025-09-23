'use client'

import React, { useState } from 'react'
import { useFormFields } from '@payloadcms/ui'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function BulkClassField() {
  const [result, setResult] = useState<{ name: string; ok: boolean; msg?: string }[]>([])
  const [names, setNames] = useState<string[]>([])

  async function createClasses() {
    const out: typeof result = []

    for (const name of names) {
      try {
        const r = await fetch('/api/class', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ Bezeichnung: name }),
        })
        const data = await r.json()
        const msg = r.ok ? undefined : data?.errors?.[0]?.message || 'Unbekannter Fehler'
        out.push({ name, ok: r.ok, msg })
      } catch (e: any) {
        out.push({ name, ok: false, msg: e?.message })
      }
    }

    setResult(out)

    // Wenn alle erfolgreich erstellt wurden, zur Liste weiterleiten
    if (out.every((r) => r.ok)) {
      setTimeout(() => {
        window.location.href = '/admin/collections/class'
      }, 2000)
    }
  }
  return (
    <>
      <div className="w-3xl">Test</div>
      <Alert id="alert-test" variant="destructive">
        <AlertTitle>Success! Your changes have been saved</AlertTitle>
        <AlertDescription>This is an alert with icon, title and description.</AlertDescription>
      </Alert>
    </>
  )
}

/**
 *     <!-- 
    <Alert variant="default">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        
        You can add components and dependencies to your app using the cli.
      </AlertDescription>
    </Alert>
    -->
 */
