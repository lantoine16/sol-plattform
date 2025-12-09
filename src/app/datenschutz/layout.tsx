import type { Metadata } from 'next'
import '../(payload)/custom.css'

export const metadata: Metadata = {
  icons: [
    { rel: 'icon', type: 'image/png', url: '/logo.png' },
    { rel: 'apple-touch-icon', type: 'image/png', url: '/logo.png' },
    { rel: 'mask-icon', type: 'image/png', url: '/logo.png' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head />
      <body>{children}</body>
    </html>
  )
}
