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
export default async function HomePage({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<Record<string, string | string[] | undefined>>
}) {
  const searchParams = await searchParamsPromise
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
    typeof searchParams?.[classSearchParamName] === 'string'
      ? Number(searchParams[classSearchParamName])
      : classes.docs[0].id

  const subjectSearchParamName = 'subject'
  const selectedSubjectId =
    typeof searchParams?.[subjectSearchParamName] === 'string'
      ? Number(searchParams[subjectSearchParamName])
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

      {selectedClassId !== undefined && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Aufgaben</h2>
          {filteredTasks && filteredTasks.docs.length > 0 ? (
            <ul className="list-disc pl-6 mt-2">
              {filteredTasks.docs.map((t: any) => (
                <li key={t.id}>{t.description}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">Keine Aufgaben gefunden.</p>
          )}
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Schüler</h2>
        {filteredUsers && filteredUsers.docs.length > 0 ? (
          <ul className="list-disc pl-6 mt-2">
            {filteredUsers.docs.map((u: any) => (
              <li key={u.id}>
                {u.firstname} {u.lastname}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">Keine Schüler gefunden.</p>
        )}
      </div>
      <div className="container mx-auto py-10">
        <DataTable columns={filteredTasks?.docs ?? []} data={filteredUsers?.docs ?? []} />
      </div>
    </div>
  )
}
