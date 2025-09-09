'use client'

import React, { useState } from 'react'
import { useFormFields } from '@payloadcms/ui'

export default function BulkClassField() {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<{ name: string; ok: boolean; msg?: string }[]>([])

  const names = text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)

  async function createClasses() {
    setBusy(true)
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
    setBusy(false)

    // Wenn alle erfolgreich erstellt wurden, zur Liste weiterleiten
    if (out.every((r) => r.ok)) {
      setTimeout(() => {
        window.location.href = '/admin/collections/class'
      }, 2000)
    }
  }

  return (
    <div
      style={{
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
      }}
    >

      <p style={{ fontSize: '14px', color: '#666', margin: '0 0 10px 0' }}>
        Geben Sie eine Klassenbezeichnung pro Zeile ein:
      </p>

      <textarea
        rows={6}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="5a&#10;5b&#10;5c&#10;6a&#10;6b"
      />

      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
        <button
          type="button"
          onClick={createClasses}
          disabled={busy || names.length === 0}
          style={{
            padding: '8px 16px',
            backgroundColor: busy ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: busy ? 'not-allowed' : 'pointer',
          }}
        >
          {busy ? 'Erstelle...' : `${names.length} Klassen erstellen`}
        </button>

        {names.length > 0 && (
          <span style={{ fontSize: '14px', color: '#666' }}>{names.length} Klasse(n) erkannt</span>
        )}
      </div>

      {result.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <h5>Ergebnisse:</h5>
          <ul style={{ fontSize: '14px', maxHeight: '200px', overflow: 'auto' }}>
            {result.map((r, index) => (
              <li
                key={index}
                style={{
                  color: r.ok ? '#28a745' : '#dc3545',
                  marginBottom: '5px',
                }}
              >
                {r.ok ? '✅' : '❌'} {r.name} {r.msg ? `— ${r.msg}` : ''}
              </li>
            ))}
          </ul>
          {result.every((r) => r.ok) && (
            <p style={{ color: '#28a745', fontWeight: 'bold' }}>
              Alle Klassen erfolgreich erstellt! Weiterleitung zur Liste...
            </p>
          )}
        </div>
      )}
    </div>
  )
}
