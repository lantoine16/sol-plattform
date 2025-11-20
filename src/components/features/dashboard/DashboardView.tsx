import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav, StepNavItem } from '@payloadcms/ui'
import React from 'react'
import { resolveIdFromSearchParams } from '@/lib/utils'
import { dashboardService } from '@/lib/services/dashboard.service'
import { userRepository } from '@/lib/data/repositories/user.repository'
import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import { SelectElement, DataTable } from '@/components/features/dashboard'
import type { UserWithTasks } from '@/lib/types'
import type { Item } from '@/components/features/dashboard/select-element'
export async function DashboardView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  if (!initPageResult.req.user) {
    return <p>You must be logged in to view this page.</p>
  }

  if (!searchParams) {
    return <div>No search params</div>
  }

  const steps: StepNavItem[] = [
    {
      url: '/dashboard',
      label: 'Dashboard',
    },
  ]

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
      lastname: user.lastname || '',
      firstname: user.firstname || '',
      tasks,
    }
  })

  return (
    <DefaultTemplate
      visibleEntities={initPageResult.visibleEntities}
      i18n={initPageResult.req.i18n}
      payload={initPageResult.req.payload}
      locale={initPageResult.locale}
      params={params}
      permissions={initPageResult.permissions}
      user={initPageResult.req.user || undefined}
      searchParams={searchParams}
    >
      <SetStepNav nav={steps} />
      <Gutter>
        <div className="space-y-8">
          <div className="flex flex-row items-center flex-wrap px-4 gap-2">
            <SelectElement
              items={learningGroups.map((learningGroup) => ({
                id: learningGroup.id,
                description: learningGroup.description || '',
              }as Item))}
              selectedId={selectedLearningGroupId}
              placeholder="Wähle eine Lerngruppe"
              searchParamName={learningGroupSearchParamName}
              itemName="Lerngruppe"
            />
            <SelectElement
              items={subjects.map((subject) => ({
                id: subject.id,
                description: subject.description || '',
              }as Item))}
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
      </Gutter>
    </DefaultTemplate>
  )
}

export default DashboardView
