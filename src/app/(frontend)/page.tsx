import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/toggle-dark-mode'
import { LogoutButton } from '@/components/LogoutButton'
import { SelectElement, DataTable } from '@/components/features/dashboard'
import { getCurrentUser } from '@/lib/data/payload-client'
import { dashboardService } from '@/lib/services/dashboard.service'
import { resolveIdFromSearchParams } from '@/lib/utils'
import config from '@/payload.config'
import { UserTasksOverview } from '@/components/features/user-tasks-overview'
import { UserCog } from 'lucide-react'
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const searchParamsResolved = await searchParams
  const payloadConfig = await config
  const user = await getCurrentUser()

  const learningGroupSearchParamName = 'learningGroup'
  const subjectSearchParamName = 'subject'
  const userSearchParamName = 'user'

  // Get learning groups and subjects
  const { learningGroups, subjects } = await dashboardService.getLearningGroupsAndSubjects()
  const selectedLearningGroupId = resolveIdFromSearchParams(
    searchParamsResolved,
    learningGroupSearchParamName,
    learningGroups,
  )
  const selectedSubjectId = resolveIdFromSearchParams(
    searchParamsResolved,
    subjectSearchParamName,
    subjects,
  )

  // Get dashboard data based on filters
  const { tasks, users: usersWithTasks } = await dashboardService.getUsersWithTasks({
    learningGroupId: selectedLearningGroupId,
    subjectId: selectedSubjectId,
  })

  const users = [{ id: '0', description: 'Alle Schüler' }].concat(
    usersWithTasks.map((user) => ({
      id: user.user_id,
      description: `${user.firstname} ${user.lastname}`,
    })),
  )

  const userIdSearchParamValue = resolveIdFromSearchParams(
    searchParamsResolved,
    userSearchParamName,
    users,
  )

  const selectedUserId =
    usersWithTasks.find((user) => user.user_id === userIdSearchParamValue)?.user_id || users[0]?.id

  const selectedUserTaskStatuses = usersWithTasks.find(
    (user) => user.user_id === selectedUserId,
  )?.tasks

  return (
    <div className="space-y-8">
      <div className="flex flex-row items-center flex-wrap px-4 pt-4 gap-2">
        <picture>
          <Image alt="IGS Ingelheim Logo" height={100} src="/igs-logo.png" width={100} />
        </picture>
        <div className="grow text-center flex flex-col items-center">
          <h1 className="text-4xl font-bold"> SOL - Plattform</h1>
          {user && (
            <h2 className="text-xl">
              Willkommen {user.firstname} {user.lastname}
            </h2>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <ModeToggle />
          {user?.role !== 'pupil' && (
            <Button className="w-full" variant="outline">
              <UserCog className="h-4 w-4" />
              <Link href={payloadConfig.routes.admin}>Admin</Link>
            </Button>
          )}
          <LogoutButton />
        </div>
      </div>
      <div className="flex flex-row items-center flex-wrap px-4 gap-2">
        <SelectElement
          items={learningGroups}
          selectedId={selectedLearningGroupId}
          placeholder="Wähle eine Lerngruppe"
          searchParamName={learningGroupSearchParamName}
          itemName="Lerngruppe"
        />
        <SelectElement
          items={subjects}
          selectedId={selectedSubjectId}
          placeholder="Wähle ein Fach"
          searchParamName={subjectSearchParamName}
          itemName="Fach"
        />
        <SelectElement
          items={users}
          selectedId={selectedUserId}
          placeholder="Wähle einen Schüler"
          searchParamName={userSearchParamName}
          itemName="Schüler"
        />
      </div>
      <div className="px-4">
        {selectedUserId === '0' ? (
          <DataTable columns={tasks} data={usersWithTasks} />
        ) : (
          selectedUserId && (
            <div className="container mx-auto">
              <UserTasksOverview
                tasks={tasks}
                userId={selectedUserId}
                userTaskStatuses={selectedUserTaskStatuses || []}
              />
            </div>
          )
        )}
      </div>
    </div>
  )
}
