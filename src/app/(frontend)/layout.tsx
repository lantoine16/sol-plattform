import React from 'react'
import './global.css'
import './styles.css'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'

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

  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <main>{children}</main>
      </body>
    </html>
  )
}
