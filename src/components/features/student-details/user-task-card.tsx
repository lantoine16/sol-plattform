'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useEffect, useState } from 'react'
import {
  updateTaskProgress,
  updateTaskHelpNeeded,
  updateTaskSearchPartner,
} from '@/lib/actions/task-progress.actions'
import { useRouter } from 'next/navigation'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'
import { TASK_ICONS } from '@/domain/constants/task-icons.constants'

type UserTaskCardProps = {
  taskId: string
  userId: string
  description: string
  previousStatus?: TaskStatusValue
  nextStatus?: TaskStatusValue
  helpNeeded?: boolean
  searchPartner?: boolean
}

export function UserTaskCard({
  taskId,
  userId,
  description,
  previousStatus,
  nextStatus,
  helpNeeded = false,
  searchPartner = false,
}: UserTaskCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isHelpNeededLoading, setIsHelpNeededLoading] = useState(false)
  const [isSearchPartnerLoading, setIsSearchPartnerLoading] = useState(false)
  const router = useRouter()
  const [localSearchPartner, setLocalSearchPartner] = useState(searchPartner)
  const [localHelpNeeded, setLocalHelpNeeded] = useState(helpNeeded)

  // Update local state when props change
  useEffect(() => {
    setLocalSearchPartner(searchPartner)
  }, [searchPartner])

  useEffect(() => {
    setLocalHelpNeeded(helpNeeded)
  }, [helpNeeded])
  const handleStatusChange = async (status: TaskStatusValue) => {
    setIsLoading(true)
    try {
      const result = await updateTaskProgress(taskId, userId, status)
      if (result.success) {
        router.refresh()
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
    setLocalHelpNeeded(checked) // Optimistic update - sofort aktualisieren
    setIsHelpNeededLoading(true)
    try {
      const result = await updateTaskHelpNeeded(taskId, userId, checked) 
      if(!result.success) {
        console.error('Failed to update help needed:', result.error)
        setLocalHelpNeeded(!checked) // Revert on error
      }
    } catch (error) {
      console.error('Failed to update help needed:', error)
      setLocalHelpNeeded(!checked) // Revert on error
    } finally {
      setIsHelpNeededLoading(false)
    }
  }

  const handleSearchPartnerChange = async (checked: boolean) => {
    setLocalSearchPartner(checked) // Optimistic update - sofort aktualisieren
    setIsSearchPartnerLoading(true)
    try {
      const result = await updateTaskSearchPartner(taskId, userId, checked)
      if (!result.success) {
        console.error('Failed to update search partner:', result.error)
        setLocalSearchPartner(!checked) // Revert on error
      }
    } catch (error) {
      console.error('Failed to update search partner:', error)
      setLocalSearchPartner(!checked) // Revert on error
    } finally {
      setIsSearchPartnerLoading(false)
    }
  }

  const HelpIcon = TASK_ICONS.helpNeeded
  const SearchPartnerIcon = TASK_ICONS.searchPartner

  return (
    <Card>
      <CardHeader>
        <CardTitle className="overflow-hidden text-ellipsis">{description}</CardTitle>
        <CardDescription className="flex gap-2 mt-1 flex-wrap">
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
          <div className="flex items-center gap-1.5">
            <Checkbox
              id={`help-needed-${taskId}`}
              checked={localHelpNeeded}
              onCheckedChange={(checked) => {
                handleHelpNeededChange(checked === true)
              }}
              disabled={isHelpNeededLoading}
              aria-label="Hilfe benötigt"
              onClick={(e) => e.stopPropagation()}
            />
            <HelpIcon className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <Checkbox
              id={`search-partner-${taskId}`}
              checked={localSearchPartner}
              onCheckedChange={(checked) => {
                handleSearchPartnerChange(checked === true)
              }}
              disabled={isSearchPartnerLoading}
              aria-label="Partner suchen"
              onClick={(e) => e.stopPropagation()}
            />
            <SearchPartnerIcon className="h-4 w-4" />
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
