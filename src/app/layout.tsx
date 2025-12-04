import React from 'react'

type Args = {
  children: React.ReactNode
}

export default function RootLayout({ children }: Args) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
