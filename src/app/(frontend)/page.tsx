import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/toggle-dark-mode'
import { LogoutButton } from '@/components/LogoutButton'
import { SelectClass } from './select-class'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

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

        <div className="flex justify-between items-center mb-4">
          <ModeToggle />
          <LogoutButton />
        </div>
        {user && <h1>Willkommen zurück, {user.email}</h1>}

        {user?.role === 'admin' && (
          <Button asChild>
            <Link href={payloadConfig.routes.admin}>Admin</Link>
          </Button>
        )}
      </div>
      <SelectClass />
    </div>
  )
}
