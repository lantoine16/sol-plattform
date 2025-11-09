'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { useState } from 'react'
import { updateTaskProgress } from '@/lib/actions/task-progress.actions'
import { useRouter } from 'next/navigation'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'

type UserTaskCardProps = {
  taskId: string
  userId: string
  description: string
  previousStatus?: TaskStatusValue
  nextStatus?: TaskStatusValue
}

export function UserTaskCard({
  taskId,
  userId,
  description,
  previousStatus,
  nextStatus,
}: UserTaskCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="overflow-hidden text-ellipsis">{description}</CardTitle>
      </CardHeader>
      <CardFooter className="flex gap-2">
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
      </CardFooter>
    </Card>
  )
}
