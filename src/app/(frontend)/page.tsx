import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { Button } from "@/components/ui/button"
import { ModeToggle } from '@/components/toggle-dark-mode'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // Lade Schüler-Daten des eingeloggten Users
  let pupilData = null
  if (user) {
    const pupils = await payload.find({
      collection: 'pupils',
      where: {
        user: {
          equals: user.id,
        },
      },
      depth: 1, // Lade verwandte Daten (Klasse)
      limit: 1,
    })
    pupilData = pupils.docs[0] || null
  }

  return (
    <div>
      <div>
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>

        <ModeToggle />
        {user && <h1>Willkommen zurück, {user.email}</h1>}

        <Button><a href={payloadConfig.routes.admin}>Admin</a></Button>

        <p className="text-amber-300">Persönlicher Schülerbereich</p>

        <div className="links">
          <a
            className="admin text-9xl"
            href={payloadConfig.routes.admin}
            rel="noopener noreferrer"
            target="_blank"
          >
            Go to admin panel testfileURL
          </a>
          <a
            className="docs"
            href="https://payloadcms.com/docs"
            rel="noopener noreferrer"
            target="_blank"
          >
            Dokumentation
          </a>
        </div>
      </div>
      <div className="footer">
        <p>Persönlicher Schülerbereich</p>
      </div>
    </div>
  )
}
