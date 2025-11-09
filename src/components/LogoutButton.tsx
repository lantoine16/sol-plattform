'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      //TODO: Refactor indem man logout action nutzt
      // Problem: Auch die Payload Doku gibt keine sinnvolle variante her
      const res = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok) {
        // Weiterleitung zur Login-Seite
        router.push('/admin/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} variant="outline" disabled={isLoading} className="w-full">
      <LogOut className="h-4 w-4"/>
      {isLoading ? 'Wird abgemeldet...' : 'Abmelden'}
    </Button>
  )
}
