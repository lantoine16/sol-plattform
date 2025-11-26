'use client'

import { useMemo, useState } from 'react'
import {
  ChevronUp,
  ChevronDown,
  Circle,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Users,
} from 'lucide-react'
import type { UserWithTaskProgressInformation } from '@/lib/services/learning-group-dashboard.service'
import { GraduationIcon } from '@/components/ui/graduation-icon'

type SortField = 'firstname' | 'lastname'
type SortDirection = 'asc' | 'desc'

export function LearningGroupDashboardTable({
  users,
}: {
  users: UserWithTaskProgressInformation[]
}) {
  const [sortField, setSortField] = useState<SortField>('lastname')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Sortierte Benutzerliste
  const sortedUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      let aValue = ''
      let bValue = ''

      if (sortField === 'firstname') {
        aValue = (a.firstname || '').toLowerCase()
        bValue = (b.firstname || '').toLowerCase()
      } else {
        aValue = (a.lastname || '').toLowerCase()
        bValue = (b.lastname || '').toLowerCase()
      }

      const comparison = aValue.localeCompare(bValue, 'de', { sensitivity: 'base' })
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [users, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 opacity-30" />
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  return (
    <div id="learning-group-dashboard-table" className="table__wrap text-sm">
      <table className="table w-full">
        <thead className="table__header">
          <tr className="table__row">
            <th
              className="table__header-cell table__header-cell--sortable min-w-fit p-1 text-xs"
              onClick={() => handleSort('firstname')}
            >
              <span>Vorname</span>
              <span className="table__sort-icon">
                <SortIcon field="firstname" />
              </span>
            </th>
            <th
              className="table__header-cell table__header-cell--sortable min-w-fit p-1 text-xs"
              onClick={() => handleSort('lastname')}
            >
              <span>Nachname</span>
              <span className="table__sort-icon">
                <SortIcon field="lastname" />
              </span>
            </th>
            <th className="table__header-cell min-w-fit min-w-fit p-1 text-xs">
              <span>Level</span>
            </th>
            <th className="table__header-cell min-w-fit p-1 text-xs">
              <span>Lernort</span>
            </th>
            <th className="table__header-cell min-w-fit p-1 text-xs">
              <span>Aufgaben</span>
            </th>
            <th className="table__header-cell min-w-fit p-1 text-xs">
              <span>Hilfe & Partner</span>
            </th>
          </tr>
        </thead>
        <tbody className="table__body">
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user) => {
              return (
                <tr key={user.userId} className="table__row">
                  <td className="table__cell p-1 min-w-fit text-xs">{user.firstname || ''}</td>
                  <td className="table__cell p-1 min-w-fit text-xs">{user.lastname || ''}</td>
                  <td className="table__cell min-w-fit p-1 text-xs">
                    <GraduationIcon number={user.graduation.number} className="h-4 w-4" />
                  </td>
                  <td className="table__cell p-1 min-w-fit text-xs">
                    {user.learningLocationDescription || '-'}
                  </td>
                  <td className="table__cell p-1 min-w-fit text-xs">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <Circle className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {user.amountOfNotStartedTasks}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-orange-600">
                          {user.progressTasksNames.length > 0 && (
                            <>{user.progressTasksNames.join(', ')}</>
                          )}
                          {user.progressTasksNames.length === 0 && (
                            <span className="text-xs text-orange-600">0</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">{user.amountOfFinishedTasks}</span>
                      </div>
                    </div>
                  </td>
                  <td className="table__cell p-1 min-w-fit text-xs">
                    <div className="flex items-center gap-1">
                      {user.needHelpTasksNames.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <HelpCircle className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600">
                            {user.needHelpTasksNames.join(', ')}
                          </span>
                        </div>
                      )}
                      {user.searchPartnerTasksNames.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600">
                            {user.searchPartnerTasksNames.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr className="table__row">
              <td colSpan={6} className="table__cell table__cell--empty">
                Keine Schüler vorhanden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
