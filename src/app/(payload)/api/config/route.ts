import { NextResponse } from 'next/server'

export async function GET() {
  // Lade Umgebungsvariablen zur Laufzeit (nicht NEXT_PUBLIC_, da diese zur Build-Zeit eingebunden werden)
  const impressumUrl = process.env.IMPRESSUM_URL || process.env.NEXT_PUBLIC_IMPRESSUM_URL || ''

  return NextResponse.json({
    impressumUrl,
  })
}

