'use client'

import { Circle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'
import { TASK_STATUS_OPTIONS, getStatusLabel } from '@/domain/constants/task-status.constants'
import { cn } from '@/lib/utils'
import { TASK_ICONS } from '@/domain/constants/task-icons.constants'
type StatusIconProps = {
  status: TaskStatusValue | null
  helpNeeded?: boolean
  className?: string
}

export function StatusIcon({ status, helpNeeded = false, className }: StatusIconProps) {
  const iconSize = 'w-3.5 h-3.5' // 14px für kompakte Darstellung

  if (!status) {
    return <div className="text-gray-400">-</div>
  }

  let icon
  let colorClass

  switch (status) {
    case TASK_STATUS_OPTIONS[0].value:
      icon = <Circle className={cn(iconSize, 'text-gray-400')} />
      colorClass = 'text-gray-400'
      break
    case TASK_STATUS_OPTIONS[1].value:
      icon = <Loader2 className={cn(iconSize, 'text-orange-500')} />
      colorClass = 'text-orange-500'
      break
    case TASK_STATUS_OPTIONS[2].value:
      icon = <CheckCircle2 className={cn(iconSize, 'text-green-600')} />
      colorClass = 'text-green-600'
      break
    default:
      icon = <div>-</div>
      colorClass = 'text-gray-400'
  }

  const statusLabel = getStatusLabel(status)
  const tooltipText = helpNeeded ? `${statusLabel} - Hilfe benötigt` : statusLabel

  return (
    <div className={cn('flex items-center justify-center relative', className)} title={tooltipText}>
      {icon}
      {helpNeeded && <TASK_ICONS.helpNeeded className={cn('w-3 h-3 text-red-500 absolute -top-2 -right-0.5')} />}
    </div>
  )
}
