'use client'

import { Circle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'
import { getStatusLabel } from '@/domain/constants/task-status.constants'
import { cn } from '@/lib/utils'

type StatusIconProps = {
  status: TaskStatusValue | null
  helpNeeded?: boolean
  className?: string
}

export function StatusIcon({ status, helpNeeded = false, className }: StatusIconProps) {
  const iconSize = 'w-3.5 h-3.5' // 14px für kompakte Darstellung

  if (!status) {
    return (
      <div className={cn('flex items-center justify-center', className)} title="Nicht begonnen">
        <Circle className={cn(iconSize, 'text-gray-300')} />
      </div>
    )
  }

  let icon
  let colorClass

  switch (status) {
    case 'not-started':
      icon = <Circle className={cn(iconSize, 'text-gray-400')} />
      colorClass = 'text-gray-400'
      break
    case 'in-progress':
      icon = <Loader2 className={cn(iconSize, 'text-orange-500 animate-spin')} />
      colorClass = 'text-orange-500'
      break
    case 'finished':
      icon = <CheckCircle2 className={cn(iconSize, 'text-green-600')} />
      colorClass = 'text-green-600'
      break
    default:
      icon = <Circle className={cn(iconSize, 'text-gray-300')} />
      colorClass = 'text-gray-300'
  }

  const statusLabel = getStatusLabel(status)
  const tooltipText = helpNeeded ? `${statusLabel} - Hilfe benötigt` : statusLabel

  return (
    <div className={cn('flex items-center justify-center relative', className)} title={tooltipText}>
      {icon}
      {helpNeeded && (
        <AlertCircle
          className="absolute -top-0.5 -right-0.5 w-2 h-2 text-red-500"
          fill="currentColor"
        />
      )}
    </div>
  )
}
