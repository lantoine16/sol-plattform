import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav, StepNavItem } from '@payloadcms/ui'
import React from 'react'
import { subjectRepository } from '@/lib/data/repositories/subject.repository'
import { learningGroupDashboardService } from '@/lib/services/learning-group-dashboard.service'
import { LearningGroupSubjectsSelectors } from '../features/learning-group-subjects-selectors/learning-group-subjects-selectors'
import { TaskBoardComponent } from '../features/task-board/task-board-component'
import { userRepository } from '@/lib/data/repositories/user.repository'
import { UserWithTaskProgress } from '@/lib/types'
import { taskProgressRepository } from '@/lib/data/repositories/task-progress.repository'
import { learningLocationRepository } from '@/lib/data/repositories/learning-location.repository'
import { USER_ROLE_ADMIN, USER_ROLE_PUPIL } from '@/domain/constants/user-role.constants'
import { LearningLocationSelector } from '../features/task-board/learning-location-selector'

export async function TaskBoardPage({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  if (!initPageResult.req.user) {
    return <p>You must be logged in to view this page.</p>
  }

  if (
    initPageResult.req.user.role !== USER_ROLE_ADMIN &&
    initPageResult.req.user.role !== USER_ROLE_PUPIL
  ) {
    return <p>You are not authorized to view this page.</p>
  }

  if (!searchParams) {
    return <div>No search params</div>
  }

  const steps: StepNavItem[] = [
    {
      url: '/taskboard',
      label: 'Taskboard',
    },
  ]

  const subjectSearchParamName = 'subject'

  const subjects = await subjectRepository.findAllSorted()

  const selectedSubjectIds = learningGroupDashboardService.getSubjectFilterValues(
    searchParams,
    subjectSearchParamName,
    subjects,
  )

  // Vollständiges User-Objekt mit allen Relationen laden

  const currentUser = await userRepository.findById(initPageResult.req.user.id, { depth: 2 })

  const taskProgresses = await taskProgressRepository.findByUsersAndSubject(
    [currentUser.id],
    selectedSubjectIds,
    { depth: 2 },
  )
  const userWithTaskProgress: UserWithTaskProgress = {
    user: currentUser,
    taskProgresses: taskProgresses,
  }

  const learningLocations = await learningLocationRepository.findAll()

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
          <div className="flex flex-row flex-wrap items-center gap-2 justify-between">
            <LearningGroupSubjectsSelectors
              learningGroups={[]}
              learningGroupSearchParamName={''}
              selectedLearningGroupId={undefined}
              subjects={subjects}
              subjectSearchParamName={subjectSearchParamName}
              selectedSubjectIds={selectedSubjectIds}
              showLearningGroupSelector={false}
            />
            <LearningLocationSelector
              allowChangeLearningLocation={
                currentUser.graduation &&
                typeof currentUser.graduation === 'object' &&
                currentUser.graduation.canChangeLearningLocation !== null &&
                currentUser.graduation.canChangeLearningLocation !== undefined
                  ? currentUser.graduation.canChangeLearningLocation
                  : false
              }
              currentLearningLocation={
                currentUser.currentLearningLocation &&
                typeof currentUser.currentLearningLocation === 'object'
                  ? {
                      value: currentUser.currentLearningLocation.id,
                      label: currentUser.currentLearningLocation.description ?? '',
                    }
                  : null
              }
              learningLocations={learningLocations}
              userId={currentUser.id}
            />
          </div>
          <TaskBoardComponent
            userWithTaskProgress={userWithTaskProgress}
            learningLocations={learningLocations}
            showAsModal={false}
          />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}

export default TaskBoardPage
