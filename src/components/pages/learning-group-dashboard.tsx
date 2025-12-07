import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav, StepNavItem } from '@payloadcms/ui'
import React from 'react'
import { learningGroupDashboardService } from '@/lib/services/learning-group-dashboard.service'
import { LearningGroupSubjectsSelectors } from '@/components/features/learning-group-subjects-selectors'
import { LearningGroupDashboardTable } from '@/components/features/dashboard/learning-group-dashboard-table'
import { ResetUserStatuses } from '../features/reset-user-statuses'
import { learningLocationRepository } from '@/lib/data/repositories/learning-location.repository'
import { USER_ROLE_ADMIN, USER_ROLE_TEACHER } from '@/domain/constants/user-role.constants'
import { findByKey } from '@/lib/data/repositories/preference.repository'
import {
  SELECTED_LEARNING_GROUP_PREFERENCE_KEY,
  SELECTED_SUBJECTS_PREFERENCE_KEY,
} from '@/domain/constants/preferences-keys.constants'
import SyncSearchParams from '../features/learning-group-subjects-selectors/sync-search-params'
import {
  LEARNING_GROUP_SEARCH_PARAM_KEY,
  SUBJECT_SEARCH_PARAM_KEY,
} from '@/domain/constants/search-param-keys.constants'
import { subjectRepository } from '@/lib/data/repositories/subject.repository'
import { learningGroupRepository } from '@/lib/data/repositories/learning-group.repository'

export async function LearningGroupDashboardView({
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
      url: '/dashboard',
      label: 'Lerngruppenübersicht',
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

  const {
    users: usersWithTaskProgress,
    taskProgressIds,
    userDefaultLearningLocationIds,
  } = await learningGroupDashboardService.getUsersWithTaskProgress(
    selectedLearningGroupIds?.[0],
    selectedSubjectIds,
  )

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
            <div className="flex justify-between items-center flex-wrap flex-row px-4">
              <LearningGroupSubjectsSelectors
                learningGroups={learningGroups}
                subjects={subjects}
                selectedLearningGroupId={selectedLearningGroupIds}
                selectedSubjectIds={selectedSubjectIds}
              />
              <ResetUserStatuses data={{ taskProgressIds, userDefaultLearningLocationIds }} />
            </div>
            <div className="px-4">
              <LearningGroupDashboardTable
                users={usersWithTaskProgress}
                learningLocations={learningLocations}
              />
            </div>
          </div>
        </Gutter>
      </DefaultTemplate>
    </>
  )
}

export default LearningGroupDashboardView
