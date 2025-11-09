'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'
const FrontendLink: React.FC = () => {
  const router = useRouter()

  return (
    <Button
      onClick={() => {
        router.push('/')
        router.refresh()
      }}
      variant="outline"
      className="w-full"
    >
      <Home className="h-4 w-4" />
      Aufgabenübersicht
    </Button>
  )
}

export default FrontendLink
