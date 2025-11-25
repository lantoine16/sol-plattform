'use client'

import { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, Circle, Loader2, CheckCircle2 } from 'lucide-react'
import type { UserWithTaskProgress } from '@/lib/services/dashboard.service'
import { getGraduationIcon, getGraduationLabel } from '@/domain/constants/user-graduation.constants'
import type { TaskStatusValue } from '@/domain/constants/task-status.constants'

type SortField = 'firstname' | 'lastname'
type SortDirection = 'asc' | 'desc'

export function DashboardTable({ users }: { users: UserWithTaskProgress[] }) {
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

  // Zähle Task-Statuses für einen User
  const getTaskCounts = (user: UserWithTaskProgress) => {
    const counts = {
      notStarted: 0,
      inProgress: 0,
      finished: 0,
    }

    user.taskProgressEntries.forEach((tp) => {
      const status = tp.status as TaskStatusValue
      if (status === 'not-started') {
        counts.notStarted++
      } else if (status === 'in-progress') {
        counts.inProgress++
      } else if (status === 'finished') {
        counts.finished++
      }
    })

    return counts
  }

  // Hole Lernort-Beschreibung
  const getLearningLocationDescription = (
    learningLocation: string | { id: string; description?: string | null } | null | undefined,
  ): string => {
    if (!learningLocation) return '-'
    if (typeof learningLocation === 'object' && learningLocation !== null) {
      return learningLocation.description || '-'
    }
    return '-'
  }

  return (
    <div className="table__wrap">
      <table className="table">
        <thead className="table__header">
          <tr className="table__row">
            <th
              className="table__header-cell table__header-cell--sortable"
              onClick={() => handleSort('firstname')}
            >
              <span>Vorname</span>
              <span className="table__sort-icon">
                <SortIcon field="firstname" />
              </span>
            </th>
            <th
              className="table__header-cell table__header-cell--sortable"
              onClick={() => handleSort('lastname')}
            >
              <span>Nachname</span>
              <span className="table__sort-icon">
                <SortIcon field="lastname" />
              </span>
            </th>
            <th className="table__header-cell">
              <span>Level</span>
            </th>
            <th className="table__header-cell">
              <span>Lernort</span>
            </th>
            <th className="table__header-cell">
              <span>Aufgaben</span>
            </th>
          </tr>
        </thead>
        <tbody className="table__body">
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user) => {
              const taskCounts = getTaskCounts(user)
              const GraduationIcon = getGraduationIcon(user.graduation)
              const graduationLabel = getGraduationLabel(user.graduation)

              return (
                <tr key={user.userId} className="table__row">
                  <td className="table__cell">{user.firstname || ''}</td>
                  <td className="table__cell">{user.lastname || ''}</td>
                  <td className="table__cell">
                    <div className="flex items-center gap-2">
                      <GraduationIcon className="h-4 w-4" />
                      <span>{graduationLabel}</span>
                    </div>
                  </td>
                  <td className="table__cell">
                    {getLearningLocationDescription(user.learningLocation)}
                  </td>
                  <td className="table__cell">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Circle className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{taskCounts.notStarted}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Loader2 className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600">{taskCounts.inProgress}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">{taskCounts.finished}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr className="table__row">
              <td colSpan={5} className="table__cell table__cell--empty">
                Keine Schüler vorhanden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
