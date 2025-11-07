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
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const searchParamsResolved = await searchParams
  const payloadConfig = await config
  const user = await getCurrentUser()

  const classSearchParamName = 'class'
  const subjectSearchParamName = 'subject'
  const userSearchParamName = 'user'

  // Get classes and subjects
  const { classes, subjects } = await dashboardService.getClassesAndSubjects()

  const selectedClassId = resolveIdFromSearchParams(
    searchParamsResolved,
    classSearchParamName,
    classes,
  )
  const selectedSubjectId = resolveIdFromSearchParams(
    searchParamsResolved,
    subjectSearchParamName,
    subjects,
  )

  // Get dashboard data based on filters
  const { tasks, users: usersWithTasks } = await dashboardService.getUsersWithTasks({
    classId: selectedClassId,
    subjectId: selectedSubjectId,
  })

  const users = [{ id: 0, description: 'Alle Schüler' }].concat(
    usersWithTasks.map((user) => ({
      id: user.user_id,
      description: `${user.firstname} ${user.lastname}`,
    })),
  )

  const selectedUserId = resolveIdFromSearchParams(searchParamsResolved, userSearchParamName, users)

  const selectedUserTaskStatuses = usersWithTasks.find(
    (user) => user.user_id === selectedUserId,
  )?.tasks
  return (
    <div>
      <div>
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>

        <div className="flex justify-between items-center mb-4">
          <ModeToggle />
          <LogoutButton />
        </div>
        {user && <h1>Willkommen zurück, {user.email}</h1>}

        {user?.role === 'admin' && (
          <Button asChild>
            <Link href={payloadConfig.routes.admin}>Admin</Link>
          </Button>
        )}
      </div>
      <SelectElement
        items={classes}
        selectedId={selectedClassId}
        placeholder="Wähle eine Klasse"
        searchParamName={classSearchParamName}
        itemName="Klasse"
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
      <div className="container mx-auto py-10">
        {selectedUserId === 0 ? (
          <DataTable columns={tasks} data={usersWithTasks} />
        ) : (
          selectedUserId && (
            <UserTasksOverview
              tasks={tasks}
              userId={selectedUserId}
              userTaskStatuses={selectedUserTaskStatuses || []}
            />
          )
        )}
      </div>
    </div>
  )
}
