import { TASK_STATUS_OPTIONS } from '@/domain/constants/task-status.constants'
import { Separator } from '@/components/ui/separator'
import { UserTaskCard } from './user-task-card'
import { UserTaskStatusService } from '@/lib/services/user-task-status.service'
import type { TaskProgress } from '@/payload-types'

type UserTasksOverviewProps = {
  userId: string
  userTaskStatuses: TaskProgress[]
}
export function UserTasksOverview({ userId, userTaskStatuses }: UserTasksOverviewProps) {
  const { notStartedTasks, inProgressTasks, finishedTasks } =
    UserTaskStatusService.groupTasksByStatus(userTaskStatuses)
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
          {notStartedTasks.map((task) => {
            const taskStatus = userTaskStatuses.find((ts) => ts.id === task.id)
            return (
              <UserTaskCard
                key={task.id}
                taskId={task.id}
                userId={userId}
                description={task.description || ''}
                previousStatus={undefined}
                nextStatus="in-progress"
                helpNeeded={taskStatus?.helpNeeded || false}
                searchPartner={taskStatus?.searchPartner || false}
              />
            )
          })}
        </div>
        <Separator orientation="vertical" className="h-auto" />
        {/* In Progress Tasks */}
        <div className="flex flex-col gap-4">
          {inProgressTasks.map((task) => {
            const taskStatus = userTaskStatuses.find((ts) => ts.id === task.id)
            return (
              <UserTaskCard
                key={task.id}
                taskId={task.id}
                userId={userId}
                description={task.description || ''}
                previousStatus="not-started"
                nextStatus="finished"
                helpNeeded={taskStatus?.helpNeeded || false}
                searchPartner={taskStatus?.searchPartner || false}
              />
            )
          })}
        </div>
        <Separator orientation="vertical" className="h-auto" />
        {/* Finished Tasks */}
        <div className="flex flex-col gap-4">
          {finishedTasks.map((task) => {
            const taskStatus = userTaskStatuses.find((ts) => ts.id === task.id)
            return (
              <UserTaskCard
                userId={userId}
                key={task.id}
                taskId={task.id}
                description={task.description || ''}
                previousStatus="in-progress"
                nextStatus={undefined}
                helpNeeded={taskStatus?.helpNeeded || false}
                searchPartner={taskStatus?.searchPartner || false}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
