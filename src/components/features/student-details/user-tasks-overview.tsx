import { useMemo } from 'react'
import { TASK_STATUS_OPTIONS } from '@/domain/constants/task-status.constants'
import { Separator } from '@/components/ui/separator'
import { UserTaskCard } from './user-task-card'
import { UserTaskStatusService } from '@/lib/services/user-task-status.service'
import { SortService } from '@/lib/services/sort.service'
import type { TaskProgress, Subject, Task } from '@/payload-types'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'

type UserTasksOverviewProps = {
  userId: string
  userTaskStatuses: TaskProgress[]
  onTaskProgressUpdate?: (taskId: string, status: TaskStatusValue) => void
  onHelpNeededUpdate?: (taskId: string, helpNeeded: boolean) => void
  onSearchPartnerUpdate?: (taskId: string, searchPartner: boolean) => void
}
export function UserTasksOverview({
  userId,
  userTaskStatuses,
  onTaskProgressUpdate,
  onHelpNeededUpdate,
  onSearchPartnerUpdate,
}: UserTasksOverviewProps) {
  const { notStartedTasks, inProgressTasks, finishedTasks } =
    UserTaskStatusService.groupTasksByStatus(userTaskStatuses)

  // Sortierte Tasks mit useMemo für Performance
  const sortedNotStartedTasks = useMemo(
    () => SortService.sortTasksBySubjectAndDate(notStartedTasks),
    [notStartedTasks],
  )
  const sortedInProgressTasks = useMemo(
    () => SortService.sortTasksBySubjectAndDate(inProgressTasks),
    [inProgressTasks],
  )
  const sortedFinishedTasks = useMemo(
    () => SortService.sortTasksBySubjectAndDate(finishedTasks),
    [finishedTasks],
  )
  return (
    <div className="space-y-4">
      {/* First row: 3 columns with status labels */}
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-stretch">
        {/* Nicht begonnen */}
        <div className="border rounded-md p-4">
          <h3 className="font-semibold mb-2">{TASK_STATUS_OPTIONS[0]?.label}</h3>
        </div>
        <Separator orientation="vertical" className="h-auto" />
        {/* In Bearbeitung */}
        <div className="border rounded-md p-4">
          <h3 className="font-semibold mb-2">{TASK_STATUS_OPTIONS[1]?.label}</h3>
        </div>
        <Separator orientation="vertical" className="h-auto" />
        {/* Benötige Hilfe */}
        <div className="border rounded-md p-4">
          <h3 className="font-semibold mb-2">{TASK_STATUS_OPTIONS[2]?.label}</h3>
        </div>
      </div>

      {/* Horizontal separator line */}
      <div className="border-t"></div>

      {/* Second row: 3 columns with task cards */}
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-stretch">
        {/* Not Started Tasks */}
        <div className="flex flex-col gap-4">
          {sortedNotStartedTasks.map((task) => {
            const taskStatus = userTaskStatuses.find((ts) => {
              const tsTaskId = typeof ts.task === 'string' ? ts.task : ts.task.id
              return tsTaskId === task.id
            })
            const subject = typeof task.subject === 'object' ? task.subject : null
            const subjectColor = subject?.color || null
            return (
              <UserTaskCard
                key={task.id}
                taskId={task.id}
                userId={userId}
                description={task.description || ''}
                previousStatus={undefined}
                nextStatus={TASK_STATUS_OPTIONS[1].value}
                helpNeeded={taskStatus?.helpNeeded || false}
                searchPartner={taskStatus?.searchPartner || false}
                subjectColor={subjectColor}
                onStatusChange={onTaskProgressUpdate}
                onHelpNeededChange={onHelpNeededUpdate}
                onSearchPartnerChange={onSearchPartnerUpdate}
              />
            )
          })}
        </div>
        <Separator orientation="vertical" className="h-auto" />
        {/* In Progress Tasks */}
        <div className="flex flex-col gap-4">
          {sortedInProgressTasks.map((task) => {
            const taskStatus = userTaskStatuses.find((ts) => {
              const tsTaskId = typeof ts.task === 'string' ? ts.task : ts.task.id
              return tsTaskId === task.id
            })
            const subject = typeof task.subject === 'object' ? task.subject : null
            const subjectColor = subject?.color || null
            return (
              <UserTaskCard
                key={task.id}
                taskId={task.id}
                userId={userId}
                description={task.description || ''}
                previousStatus={TASK_STATUS_OPTIONS[0].value}
                nextStatus={TASK_STATUS_OPTIONS[2].value}
                helpNeeded={taskStatus?.helpNeeded || false}
                searchPartner={taskStatus?.searchPartner || false}
                subjectColor={subjectColor}
                onStatusChange={onTaskProgressUpdate}
                onHelpNeededChange={onHelpNeededUpdate}
                onSearchPartnerChange={onSearchPartnerUpdate}
              />
            )
          })}
        </div>
        <Separator orientation="vertical" className="h-auto" />
        {/* Finished Tasks */}
        <div className="flex flex-col gap-4">
          {sortedFinishedTasks.map((task) => {
            const taskStatus = userTaskStatuses.find((ts) => {
              const tsTaskId = typeof ts.task === 'string' ? ts.task : ts.task.id
              return tsTaskId === task.id
            })
            const subject = typeof task.subject === 'object' ? task.subject : null
            const subjectColor = subject?.color || null
            return (
              <UserTaskCard
                userId={userId}
                key={task.id}
                taskId={task.id}
                description={task.description || ''}
                previousStatus={TASK_STATUS_OPTIONS[1].value}
                nextStatus={undefined}
                helpNeeded={taskStatus?.helpNeeded || false}
                searchPartner={taskStatus?.searchPartner || false}
                subjectColor={subjectColor}
                onStatusChange={onTaskProgressUpdate}
                onHelpNeededChange={onHelpNeededUpdate}
                onSearchPartnerChange={onSearchPartnerUpdate}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
