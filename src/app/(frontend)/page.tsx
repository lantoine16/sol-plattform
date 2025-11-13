import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/toggle-dark-mode'
import { LogoutButton } from '@/components/LogoutButton'
import { SelectElement, DataTable } from '@/components/features/dashboard'
import { getCurrentUser } from '@/lib/data/payload-client'
import { dashboardService } from '@/lib/services/dashboard.service'
import { userRepository } from '@/lib/data/repositories/user.repository'
import { resolveIdFromSearchParams } from '@/lib/utils'
import config from '@/payload.config'
import { UserCog } from 'lucide-react'
import { Params } from 'next/dist/server/request/params'
import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import type { UserWithTasks } from '@/lib/types'
export default async function HomePage({
  searchParams,
}: {
  searchParams: Params | undefined | Promise<Params>
}) {
  if (searchParams instanceof Promise) {
    searchParams = await searchParams
  }
  if (!searchParams) {
    return <div>No search params</div>
  }
  //const searchParamsResolved = await searchParams
  const payloadConfig = await config
  const user = await getCurrentUser()

  const learningGroupSearchParamName = 'learningGroup'
  const subjectSearchParamName = 'subject'

  // Get learning groups and subjects
  const { learningGroups, subjects } = await dashboardService.getLearningGroupsAndSubjects()
  const selectedLearningGroupId = resolveIdFromSearchParams(
    searchParams,
    learningGroupSearchParamName,
    learningGroups,
  )
  const selectedSubjectId = resolveIdFromSearchParams(
    searchParams,
    subjectSearchParamName,
    subjects,
  )

  const users = await userRepository.findPupilsByLearningGroup(selectedLearningGroupId ?? '')
  // Get dashboard data based on filters
  const taskProgressEntries = await taskProgressRepository.findByUsersAndSubject(
    users.map((user) => user.id),
    selectedSubjectId ?? '',
    { depth: 2 }, // Relationships auflösen (user und task als Objekte)
  )

  // Extrahiere eindeutige Tasks aus den TaskProgress-Einträgen
  const uniqueTaskIds = new Set(
    taskProgressEntries.map((tp) => {
      return typeof tp.task === 'object' ? tp.task?.id || '' : tp.task
    }),
  )

  // Hole die vollständigen Task-Objekte (ohne Duplikate)
  const tasks = Array.from(uniqueTaskIds)
    .map((taskId) => {
      // Finde das Task-Objekt aus den TaskProgress-Einträgen
      const taskProgress = taskProgressEntries.find((tp) => {
        const tpTaskId = typeof tp.task === 'object' ? tp.task?.id || '' : tp.task
        return tpTaskId === taskId
      })
      return typeof taskProgress?.task === 'object' ? taskProgress.task : null
    })
    .filter((task): task is NonNullable<typeof task> => task !== null)

  const tasksByUser: UserWithTasks[] = users.map((user) => {
    // Finde alle TaskProgress-Einträge für diesen User
    const userTaskProgress = taskProgressEntries.filter((tp) => {
      const userId = typeof tp.user === 'object' ? tp.user?.id : tp.user
      return userId === user.id
    })

    // Transformiere zu der gewünschten Struktur
    const tasks = userTaskProgress.map((tp) => {
      return {
        taskId: typeof tp.task === 'object' ? tp.task?.id || '' : tp.task,
        status: tp.status,
        helpNeeded: tp.helpNeeded || false,
      }
    })

    return {
      userId: user.id,
      lastname: user.lastname,
      firstname: user.firstname,
      tasks,
    }
  })

  console.log(tasksByUser)
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
      </div>
      <div className="px-4">
        <DataTable columns={tasks} data={tasksByUser} />
      </div>
    </div>
  )
}
