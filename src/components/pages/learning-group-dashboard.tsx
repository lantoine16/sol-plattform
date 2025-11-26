import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav, StepNavItem } from '@payloadcms/ui'
import React from 'react'
import { learningGroupDashboardService } from '@/lib/services/learning-group-dashboard.service'
import { LearningGroupSubjectsSelectors } from '@/components/features/learning-group-subjects-selectors'
import { LearningGroupDashboardTable } from '@/components/features/dashboard/learning-group-dashboard-table'
import { ResetUserStatuses } from '../features/reset-user-statuses'

export async function LearningGroupDashboardView({
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
      url: '/dashboard',
      label: 'Lerngruppenübersicht',
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

  const {
    users: usersWithTaskProgress,
    taskProgressIds,
    userDefaultLearningLocationIds,
  } = await learningGroupDashboardService.getUsersWithTaskProgress(
    selectedLearningGroupId,
    selectedSubjectIds,
  )

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
          <div className="flex justify-between items-center flex-wrap flex-row px-4">
            <LearningGroupSubjectsSelectors
              learningGroups={learningGroups}
              subjects={subjects}
              learningGroupSearchParamName={learningGroupSearchParamName}
              subjectSearchParamName={subjectSearchParamName}
              selectedLearningGroupId={selectedLearningGroupId}
              selectedSubjectIds={selectedSubjectIds}
            />
            <ResetUserStatuses data={{ taskProgressIds, userDefaultLearningLocationIds }} />
          </div>
          <div className="px-4">
            <LearningGroupDashboardTable users={usersWithTaskProgress} />
          </div>
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}

export default LearningGroupDashboardView
