import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav, StepNavItem } from '@payloadcms/ui'
import React from 'react'

export async function TaskBoardPage({
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
        url: '/taskBoard',
        label: 'Taskboard',
      },
    ]
  
    const subjectSearchParamName = 'subject'

  
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
        </Gutter>
      </DefaultTemplate>
    )
  }
  
  export default TaskBoardPage
  