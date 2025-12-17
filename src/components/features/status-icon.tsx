'use client'

import { Circle, Loader2, CheckCircle2, OctagonX, Loader, UserRoundPen } from 'lucide-react'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'
import { TASK_STATUS_OPTIONS, getStatusLabel } from '@/domain/constants/task-status.constants'
import { cn } from '@/lib/utils'
type StatusIconProps = {
  status: TaskStatusValue | null
  className?: string
  iconSize?: string
}

export function StatusIcon({ status, className, iconSize = 'w-4.5 h-4.5' }: StatusIconProps) {

  if (!status) {
    return <div className="text-gray-400">-</div>
  }

  let icon

  switch (status) {
    case TASK_STATUS_OPTIONS[0].value:
      icon = <OctagonX className={cn(iconSize, 'text-red-700')} />
      break
    case TASK_STATUS_OPTIONS[1].value:
      icon = <UserRoundPen className={cn(iconSize, 'text-yellow-600')} />
      break
    case TASK_STATUS_OPTIONS[2].value:
      icon = <CheckCircle2 className={cn(iconSize, 'text-green-800')} />
      break
    default:
      icon = <div>-</div>
  }

  const statusLabel = getStatusLabel(status)

  return (
    <div className={cn('flex items-center justify-center relative', className)} title={statusLabel}>
      {icon}
    </div>
  )
}
