import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/toggle-dark-mode'
import { LogoutButton } from '@/components/LogoutButton'
import { SelectElement } from './select-element'
import { DataTable } from './data-table'
import { UserWithTasks, UserTaskStatus } from './types'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const searchParamsResolved = await searchParams
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const [classes, subjects] = await Promise.all([
    payload.find({ collection: 'classes', sort: 'description' }),
    payload.find({ collection: 'subjects', sort: 'description' }),
  ])

  const classSearchParamName = 'class'
  const selectedClassId =
    typeof searchParamsResolved?.[classSearchParamName] === 'string'
      ? Number(searchParamsResolved[classSearchParamName])
      : classes.docs[0].id

  const subjectSearchParamName = 'subject'
  const selectedSubjectId =
    typeof searchParamsResolved?.[subjectSearchParamName] === 'string'
      ? Number(searchParamsResolved[subjectSearchParamName])
      : subjects.docs[0].id

  const [filteredTasks, filteredUsers] =
    selectedClassId !== undefined && selectedSubjectId !== undefined
      ? await Promise.all([
          payload.find({
            collection: 'tasks',
            where: {
              subject: {
                equals: selectedSubjectId,
              },
              class: {
                equals: selectedClassId,
              },
            },
            sort: 'description',
          }),
          payload.find({
            collection: 'users',
            where: {
              class: {
                equals: selectedClassId,
              },
              role: {
                equals: 'pupil',
              },
            },
            sort: 'lastname',
          }),
        ])
      : [null, null]

  // Lade alle task-progress Einträge für die gefilterten User und Tasks
  const taskProgressData =
    filteredUsers !== null &&
    filteredTasks !== null &&
    filteredUsers.docs.length > 0 &&
    filteredTasks.docs.length > 0
      ? await payload.find({
          collection: 'task-progress',
          where: {
            and: [
              {
                student: {
                  in: filteredUsers.docs.map((user) => user.id),
                },
              },
              {
                task: {
                  in: filteredTasks.docs.map((task) => task.id),
                },
              },
            ],
          },
          depth: 2, // Lade student und task Relationships auf
        })
      : null
  // Transformiere die Daten: Alle User zurückgeben mit ihren task-progress Einträgen
  const usersWithTasks: UserWithTasks[] = filteredUsers
    ? filteredUsers.docs.map((user) => {
        // Finde alle task-progress Einträge für diesen User
        const userTaskProgress = taskProgressData?.docs.filter((tp) => {
          const studentId = typeof tp.student === 'object' ? tp.student?.id : tp.student
          return studentId === user.id
        })
        // Transformiere zu der gewünschten Struktur
        const tasks: UserTaskStatus[] = userTaskProgress
          ? userTaskProgress.map((tp) => {
              return {
                task_id: typeof tp.task === 'object' ? tp.task?.id : tp.task,
                status: tp.status as UserTaskStatus['status'],
              }
            })
          : []

        return {
          user_id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          tasks: tasks, // Leeres Array, wenn keine task-progress Einträge vorhanden
        }
      })
    : []

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
        items={classes.docs}
        selectedId={selectedClassId}
        placeholder="Wähle eine Klasse"
        searchParamName={classSearchParamName}
        itemName="Klasse"
      />
      <SelectElement
        items={subjects.docs}
        selectedId={selectedSubjectId}
        placeholder="Wähle ein Fach"
        searchParamName={subjectSearchParamName}
        itemName="Fach"
      />
      <div className="container mx-auto py-10">
        <DataTable columns={filteredTasks?.docs ?? []} data={usersWithTasks ?? []} />
      </div>
    </div>
  )
}
