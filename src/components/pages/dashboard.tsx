import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav, StepNavItem } from '@payloadcms/ui'
import React from 'react'
import { UserWithTaskProgress, dashboardService } from '@/lib/services/dashboard.service'
import { userRepository } from '@/lib/data/repositories/user.repository'
import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import { LearningGroupSubjectsSelectors } from '@/components/features/learning-group-subjects-selectors'
import { DashboardTable } from '@/components/features/dashboard/dashboard-table'
import { UserGraduationValue } from '@/domain/constants/user-graduation.constants'

export async function DashboardView({
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
      label: 'Dashboard',
    },
  ]

  const learningGroupSearchParamName = 'learningGroup'
  const subjectSearchParamName = 'subject'

  // Get learning groups and subjects
  const { learningGroups, subjects } = await dashboardService.getLearningGroupsAndSubjects()

  // Get selected values using the dashboard service
  const { selectedLearningGroupId, selectedSubjectIds } =
    dashboardService.getSubjectAndLearngingGroupsFilterValues(
      searchParams,
      learningGroupSearchParamName,
      subjectSearchParamName,
      learningGroups,
      subjects,
    )

  const users = await userRepository.findPupilsByLearningGroup(selectedLearningGroupId ?? '')

  const usersWithTaskProgress: UserWithTaskProgress[] = await Promise.all(
    users.map(async (user) => ({
      userId: user.id,
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      graduation: user.graduation as UserGraduationValue,
      learningLocation: user.learningLocation as string | null,
      taskProgressEntries: await taskProgressRepository.findByUsersAndSubject(
        [user.id],
        selectedSubjectIds,
      ),
    })),
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
          <LearningGroupSubjectsSelectors
            learningGroups={learningGroups}
            subjects={subjects}
            learningGroupSearchParamName={learningGroupSearchParamName}
            subjectSearchParamName={subjectSearchParamName}
            selectedLearningGroupId={selectedLearningGroupId}
            selectedSubjectIds={selectedSubjectIds}
          />
          <div className="px-4">
            <DashboardTable users={usersWithTaskProgress} />
          </div>
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}

export default DashboardView
