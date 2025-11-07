import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/toggle-dark-mode'
import { LogoutButton } from '@/components/LogoutButton'
import { SelectElement, DataTable } from '@/components/features/dashboard'
import { getCurrentUser } from '@/lib/data/payload-client'
import { dashboardService } from '@/lib/services/dashboard.service'
import config from '@/payload.config'
import type { UserWithTasks } from '@/lib/types'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const searchParamsResolved = await searchParams
  const payloadConfig = await config
  const user = await getCurrentUser()

  // Get classes and subjects
  const { classes, subjects } = await dashboardService.getClassesAndSubjects()

  // Resolve filters from search params
  const filters = dashboardService.resolveFilters(searchParamsResolved, classes, subjects)

  // Get dashboard data based on filters
  const { tasks, users: usersWithTasks } = await dashboardService.getDashboardData(filters)

  const classSearchParamName = 'class'
  const subjectSearchParamName = 'subject'

  return (
    <div>
      <div>
        <picture>
          <source srcSet="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg" />
          <Image
            alt="Payload Logo"
            height={65}
            src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
            width={65}
          />
        </picture>

        <div className="flex justify-between items-center mb-4">
          <ModeToggle />
          <LogoutButton />
        </div>
        {user && <h1>Willkommen zurück, {user.email}</h1>}

        {user?.role === 'admin' && (
          <Button asChild>
            <Link href={payloadConfig.routes.admin}>Admin</Link>
          </Button>
        )}
      </div>
      <SelectElement
        items={classes}
        selectedId={filters.classId}
        placeholder="Wähle eine Klasse"
        searchParamName={classSearchParamName}
        itemName="Klasse"
      />
      <SelectElement
        items={subjects}
        selectedId={filters.subjectId}
        placeholder="Wähle ein Fach"
        searchParamName={subjectSearchParamName}
        itemName="Fach"
      />
      <div className="container mx-auto py-10">
        <DataTable columns={tasks} data={usersWithTasks} />
      </div>
    </div>
  )
}
