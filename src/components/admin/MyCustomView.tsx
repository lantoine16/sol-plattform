import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter, SetStepNav, StepNavItem } from '@payloadcms/ui'
import React from 'react'
import HomePage from '@/app/(frontend)/page'

export function MyCustomView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  if (!initPageResult.req.user) {
    return <p>You must be logged in to view this page.</p>
  }

  const steps: StepNavItem[] = [
    {
      url: '/analytics',
      label: 'Analytics',
    },
  ]

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
        <HomePage searchParams={searchParams} />
      </Gutter>
    </DefaultTemplate>
  )
}

export default MyCustomView
