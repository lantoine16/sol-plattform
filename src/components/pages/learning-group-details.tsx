import type { AdminViewServerProps } from 'payload'

// Force dynamic rendering so searchParams and auth headers are present in production.
export const dynamic = 'force-dynamic'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav, StepNavItem } from '@payloadcms/ui'
import React from 'react'
import { learningGroupDashboardService } from '@/lib/services/learning-group-dashboard.service'
import { userRepository } from '@/lib/data/repositories/user.repository'
import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import { learningLocationRepository } from '@/lib/data/repositories/learning-location.repository'
import { SortService } from '@/lib/services/sort.service'
import { LearningGroupSubjectsSelectors } from '@/components/features/learning-group-subjects-selectors'
import { DataTable } from '@/components/features/learning-group-details/data-table'
import type { UserWithTaskProgress } from '@/lib/types'
import { USER_ROLE_ADMIN, USER_ROLE_TEACHER } from '@/domain/constants/user-role.constants'
import {
  LEARNING_GROUP_SEARCH_PARAM_KEY,
  SUBJECT_SEARCH_PARAM_KEY,
} from '@/domain/constants/search-param-keys.constants'
import {
  SELECTED_LEARNING_GROUP_PREFERENCE_KEY,
  SELECTED_SUBJECTS_PREFERENCE_KEY,
} from '@/domain/constants/preferences-keys.constants'
import SyncSearchParams from '../features/learning-group-subjects-selectors/sync-search-params'
import { subjectRepository } from '@/lib/data/repositories/subject.repository'
import { learningGroupRepository } from '@/lib/data/repositories/learning-group.repository'

export async function LearningGroupDetailsView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  if (!initPageResult.req.user) {
    return <p>You must be logged in to view this page.</p>
  }

  if (
    initPageResult.req.user.role !== USER_ROLE_ADMIN &&
    initPageResult.req.user.role !== USER_ROLE_TEACHER
  ) {
    return <p>You are not authorized to view this page.</p>
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

  const [learningGroups, subjects] = await Promise.all([
    learningGroupRepository.findAllSorted(),
    subjectRepository.findAllSorted(),
  ])
  // Get selected values using the learning group dashboard service
  const [
    { ids: selectedLearningGroupIds, needToSyncParams: needToSyncLearningGroupParams },
    { ids: selectedSubjectIds, needToSyncParams: needToSyncSubjectParams },
  ] = await Promise.all([
    learningGroupDashboardService.getFilterValues(
      searchParams,
      LEARNING_GROUP_SEARCH_PARAM_KEY,
      SELECTED_LEARNING_GROUP_PREFERENCE_KEY,
      [learningGroups.map((learningGroup) => learningGroup.id)?.[0]],
    ),
    learningGroupDashboardService.getFilterValues(
      searchParams,
      SUBJECT_SEARCH_PARAM_KEY,
      SELECTED_SUBJECTS_PREFERENCE_KEY,
      subjects.map((subject) => subject.id),
    )
  ])


  const users = await userRepository.findPupilsByLearningGroup(
    selectedLearningGroupIds?.[0] ?? '',
    {
      depth: 2,
    },
  )

  // Get learning group dashboard data based on filters
  const taskProgressEntries = await taskProgressRepository.findByUsersAndSubject(
    users.map((user) => user.id),
    selectedSubjectIds ?? [],
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

  const learningLocations = await learningLocationRepository.findAll()

  return (
    <>
      <SyncSearchParams
        subjectSearchParams={selectedSubjectIds}
        learningGroupSearchParam={selectedLearningGroupIds}
        needToSyncSubjectParams={needToSyncSubjectParams}
        needToSyncLearningGroupParams={needToSyncLearningGroupParams}
      />
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
              selectedLearningGroupId={selectedLearningGroupIds}
              selectedSubjectIds={selectedSubjectIds}
            />
            <div className="px-4">
              <DataTable columns={tasks} data={tasksByUser} learningLocations={learningLocations} />
            </div>
          </div>
        </Gutter>
      </DefaultTemplate>
    </>
  )
}

export default LearningGroupDetailsView
