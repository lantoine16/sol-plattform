'use client'
import { SetLearningLocationsOptions } from '@/lib/data/repositories/user.repository'
import { resetUserStatuses as resetUserStatusesAction } from '@/lib/actions/reset-user-statuses.actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
export type ResetUserStatusesProps = {
  taskProgressIds: string[]
  userDefaultLearningLocationIds: SetLearningLocationsOptions[]
}
export function ResetUserStatuses({ data }: { data: ResetUserStatusesProps }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleReset = async () => {
    setIsLoading(true)
    const result = await resetUserStatusesAction(
      data.taskProgressIds,
      data.userDefaultLearningLocationIds,
    )
    if (!result.success) {
      console.error('Fehler beim Zurücksetzen der Status:', result.error)
    }
    router.refresh()
    setIsLoading(false)
  }
  const buttonClassName = [
    'btn',
    'btn--icon-style-without-border',
    'btn--size-medium',
    'btn--withoutPopup',
    'btn--style-primary',
    'm-0',
    isLoading ? 'btn--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" onClick={handleReset} disabled={isLoading} className={buttonClassName}>
      Stundenende
    </button>
  )
}
