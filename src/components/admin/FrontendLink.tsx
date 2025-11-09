'use client'

import React from 'react'
import { Home } from 'lucide-react'
import Link from 'next/link'
const FrontendLink: React.FC = () => {
  return (
    <Link href="/">
      <Home className="h-4 w-4" />
      <span> Aufgabenübersicht</span>
    </Link>
  )
}

export default FrontendLink
