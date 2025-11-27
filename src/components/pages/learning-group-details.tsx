import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav, StepNavItem } from '@payloadcms/ui'
import React from 'react'
import { learningGroupDashboardService } from '@/lib/services/learning-group-dashboard.service'
import { userRepository } from '@/lib/data/repositories/user.repository'
import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import { SortService } from '@/lib/services/sort.service'
import { LearningGroupSubjectsSelectors } from '@/components/features/learning-group-subjects-selectors'
import { DataTable } from '@/components/features/learning-group-details/data-table'
import type { UserWithTaskProgress } from '@/lib/types'

export async function LearningGroupDetailsView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  if (!initPageResult.req.user) {
    return <p>You must be logged in to view this page.</p>
  }

  if (!searchParams) {
    return <div>No search params</div>
  }

  const steps: StepNavItem[] = [
    {
      url: '/detailView',
      label: 'Detailansicht',
    },
  ]

  const learningGroupSearchParamName = 'learningGroup'
  const subjectSearchParamName = 'subject'

  // Get learning groups and subjects
  const { learningGroups, subjects } =
    await learningGroupDashboardService.getLearningGroupsAndSubjects()

  // Get selected values using the learning group dashboard service
  const { selectedLearningGroupId, selectedSubjectIds } =
    learningGroupDashboardService.getSubjectAndLearngingGroupsFilterValues(
      searchParams,
      learningGroupSearchParamName,
      subjectSearchParamName,
      learningGroups,
      subjects,
    )

  const users = await userRepository.findPupilsByLearningGroup(selectedLearningGroupId ?? '', {
    depth: 2,
  })

  // Get learning group dashboard data based on filters
  const taskProgressEntries = await taskProgressRepository.findByUsersAndSubject(
    users.map((user) => user.id),
    selectedSubjectIds,
    { depth: 2 }, // Relationships auflösen (user und task als Objekte)
  )

  // Extrahiere eindeutige Tasks aus den TaskProgress-Einträgen
  const uniqueTaskIds = new Set(
    taskProgressEntries.map((tp) => {
      return typeof tp.task === 'object' ? tp.task?.id || '' : tp.task
    }),
  )

  // Hole die vollständigen Task-Objekte (ohne Duplikate)
  const tasks = SortService.sortTasksBySubjectAndDate(
    Array.from(uniqueTaskIds)
      .map((taskId) => {
        // Finde das Task-Objekt aus den TaskProgress-Einträgen
        const taskProgress = taskProgressEntries.find((tp) => {
          const tpTaskId = typeof tp.task === 'object' ? tp.task?.id || '' : tp.task
          return tpTaskId === taskId
        })
        return typeof taskProgress?.task === 'object' ? taskProgress.task : null
      })
      .filter((task): task is NonNullable<typeof task> => task !== null),
  )

  const tasksByUser: UserWithTaskProgress[] = users.map((user) => {
    // Finde alle TaskProgress-Einträge für diesen User
    const userTaskProgress = taskProgressEntries.filter((tp) => {
      const userId = typeof tp.user === 'object' ? tp.user?.id : tp.user
      return userId === user.id
    })

    return {
      user: user,
      taskProgresses: userTaskProgress,
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
          <LearningGroupSubjectsSelectors
            learningGroups={learningGroups}
            subjects={subjects}
            learningGroupSearchParamName={learningGroupSearchParamName}
            subjectSearchParamName={subjectSearchParamName}
            selectedLearningGroupId={selectedLearningGroupId}
            selectedSubjectIds={selectedSubjectIds}
          />
          <div className="px-4">
            <DataTable columns={tasks} data={tasksByUser} />
          </div>
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}

export default LearningGroupDetailsView
