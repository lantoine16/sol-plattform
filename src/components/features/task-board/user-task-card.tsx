'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'
import {
  updateTaskProgress,
  updateTaskHelpNeeded,
  updateTaskSearchPartner,
} from '@/lib/actions/task-progress.actions'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'
import { TASK_ICONS } from '@/domain/constants/task-icons.constants'
import { getSubjectColor } from '@/domain/constants/subject-color.constants'
import { useTheme } from 'next-themes'

type UserTaskCardProps = {
  taskId: string
  userId: string
  title: string
  description?: string
  previousStatus?: TaskStatusValue
  nextStatus?: TaskStatusValue
  helpNeeded?: boolean
  searchPartner?: boolean
  subjectColor?: string | null
  onStatusChange?: (taskId: string, status: TaskStatusValue) => void
  onHelpNeededChange?: (taskId: string, helpNeeded: boolean) => void
  onSearchPartnerChange?: (taskId: string, searchPartner: boolean) => void
}

export function UserTaskCard({
  taskId,
  userId,
  title,
  description,
  previousStatus,
  nextStatus,
  helpNeeded = false,
  searchPartner = false,
  subjectColor,
  onStatusChange,
  onHelpNeededChange,
  onSearchPartnerChange,
}: UserTaskCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isHelpNeededLoading, setIsHelpNeededLoading] = useState(false)
  const [isSearchPartnerLoading, setIsSearchPartnerLoading] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark' || theme === 'dark'

  // Berechne die Hintergrundfarbe basierend auf dem Subject
  const backgroundColor = getSubjectColor(subjectColor, isDarkMode)

  const handleStatusChange = async (status: TaskStatusValue) => {
    setIsLoading(true)
    try {
      const result = await updateTaskProgress(taskId, userId, status)
      if (result.success) {
        // Update local state immediately for instant UI feedback
        onStatusChange?.(taskId, status)
      } else {
        console.error('Failed to update task progress:', result.error)
      }
    } catch (error) {
      console.error('Failed to update task progress:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleHelpNeededChange = async (checked: boolean) => {
    setIsHelpNeededLoading(true)
    try {
      const result = await updateTaskHelpNeeded(taskId, userId, checked)
      if (result.success) {
        // Update parent state immediately for instant UI feedback
        onHelpNeededChange?.(taskId, checked)
      } else {
        console.error('Failed to update help needed:', result.error)
      }
    } catch (error) {
      console.error('Failed to update help needed:', error)
    } finally {
      setIsHelpNeededLoading(false)
    }
  }

  const handleSearchPartnerChange = async (checked: boolean) => {
    setIsSearchPartnerLoading(true)
    try {
      const result = await updateTaskSearchPartner(taskId, userId, checked)
      if (result.success) {
        // Update parent state immediately for instant UI feedback
        onSearchPartnerChange?.(taskId, checked)
      } else {
        console.error('Failed to update search partner:', result.error)
      }
    } catch (error) {
      console.error('Failed to update search partner:', error)
    } finally {
      setIsSearchPartnerLoading(false)
    }
  }

  const HelpIcon = TASK_ICONS.helpNeeded
  const SearchPartnerIcon = TASK_ICONS.searchPartner

  return (
    <Card style={{ backgroundColor }}>
      <CardHeader>
        <CardTitle className="overflow-hidden text-ellipsis">{title}</CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <div>{description}</div>
          <div className="flex gap-2 mt-1 flex-wrap justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => previousStatus && handleStatusChange(previousStatus)}
              disabled={isLoading || !previousStatus}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => nextStatus && handleStatusChange(nextStatus)}
              disabled={isLoading || !nextStatus}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Checkbox
                id={`help-needed-${taskId}`}
                checked={helpNeeded}
                onCheckedChange={(checked) => {
                  handleHelpNeededChange(checked === true)
                }}
                disabled={isHelpNeededLoading}
                aria-label="Hilfe benötigt"
                onClick={(e) => e.stopPropagation()}
                className="size-9"
              />
              <HelpIcon className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <Checkbox
                id={`search-partner-${taskId}`}
                checked={searchPartner}
                onCheckedChange={(checked) => {
                  handleSearchPartnerChange(checked === true)
                }}
                disabled={isSearchPartnerLoading}
                aria-label="Partner suchen"
                onClick={(e) => e.stopPropagation()}
                className="size-9"
              />
              <SearchPartnerIcon className="h-4 w-4" />
            </div>
          </div>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
