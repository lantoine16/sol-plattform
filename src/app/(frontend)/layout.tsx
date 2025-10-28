import React from 'react'
import { headers as getHeaders } from 'next/headers.js'
import { redirect } from 'next/navigation.js'
import './global.css'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  // Check authentication
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // If not authenticated, redirect to admin login
  if (!user) {
    redirect('/admin/login')
  }

  // Only pupils can access the frontend
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased dark:bg-black dark:text-white',
          fontSans.variable,
        )}
      >
        <main>{children}</main>
      </body>
    </html>
  )
}
