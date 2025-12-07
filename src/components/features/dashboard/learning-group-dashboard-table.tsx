'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Circle,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Users,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import type { UserWithTaskProgressInformation } from '@/lib/services/learning-group-dashboard.service'
import { GraduationIcon } from '@/components/ui/graduation-icon'
import { TaskBoardComponent } from '@/components/features/task-board/task-board-component'
import type { UserWithTaskProgress } from '@/lib/types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { LearningLocation } from '@/payload-types'
import { usePreferences } from '@payloadcms/ui'
import { DASHBOARD_SORT_PREFERENCE_KEY } from '@/domain/constants/preferences-keys.constants'
import { SORT_SEARCH_PARAM_KEY } from '@/domain/constants/search-param-keys.constants'
export type SortField =
  | 'firstname'
  | '-firstname'
  | 'lastname'
  | '-lastname'
  | 'level'
  | '-level'
  | 'learningLocation'
  | '-learningLocation'

export function LearningGroupDashboardTable({
  users,
  learningLocations,
  initialSortParam,
}: {
  users: UserWithTaskProgressInformation[]
  learningLocations: LearningLocation[]
  initialSortParam: SortField[] | undefined
}) {
  const { setPreference } = usePreferences()
  const [sortParam, setSortParam] = useState<SortField | undefined>(initialSortParam?.[0])
  const [selectedUser, setSelectedUser] = useState<UserWithTaskProgress | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  // Sortierte Benutzerliste
  const sortedUsers = useMemo(() => {
    if (!sortParam) {
      return users
    }
    const sorted = [...users].sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      if (sortParam === 'firstname' || sortParam === '-firstname') {
        aValue = (a.user.firstname || '').toLowerCase()
        bValue = (b.user.firstname || '').toLowerCase()
      } else if (sortParam === 'lastname' || sortParam === '-lastname') {
        aValue = (a.user.lastname || '').toLowerCase()
        bValue = (b.user.lastname || '').toLowerCase()
      } else if (sortParam === 'level' || sortParam === '-level') {
        // Sortiere nach Graduation Number
        aValue =
          a.user.graduation && typeof a.user.graduation === 'object'
            ? a.user.graduation.number || 1
            : 1
        bValue =
          b.user.graduation && typeof b.user.graduation === 'object'
            ? b.user.graduation.number || 1
            : 1
      } else if (sortParam === 'learningLocation' || sortParam === '-learningLocation') {
        // Sortiere nach Lernort-Beschreibung
        aValue =
          a.user.currentLearningLocation && typeof a.user.currentLearningLocation === 'object'
            ? (a.user.currentLearningLocation.description || '').toLowerCase()
            : ''
        bValue =
          b.user.currentLearningLocation && typeof b.user.currentLearningLocation === 'object'
            ? (b.user.currentLearningLocation.description || '').toLowerCase()
            : ''
      }

      let comparison: number
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else {
        comparison = String(aValue).localeCompare(String(bValue), 'de', {
          sensitivity: 'base',
        })
      }

      return sortParam.startsWith('-') ? -comparison : comparison
    })

    return sorted
  }, [users, sortParam])

  const handleRowClick = (userWithTaskProgress: UserWithTaskProgressInformation) => {
    // Konvertiere UserWithTaskProgressInformation zu UserWithTaskProgress
    const userWithTaskProgressForModal: UserWithTaskProgress = {
      user: userWithTaskProgress.user,
      taskProgresses: userWithTaskProgress.taskProgresses,
    }
    setSelectedUser(userWithTaskProgressForModal)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
    router.refresh()
  }

  const SortButtons = ({ field, label }: { field: SortField; label: string }) => {
    const isActive = sortParam === field || sortParam === `-${field}`
    const isAscActive = isActive && !sortParam.startsWith('-')
    const isDescActive = isActive && sortParam.startsWith('-')

    const handleClick = (e: React.MouseEvent, sortDirection: '' | '-') => {
      e.stopPropagation()
      const sortParam = sortDirection === '' ? field : `-${field}`
      setSortParam(sortParam as SortField)
      setPreference(DASHBOARD_SORT_PREFERENCE_KEY, sortParam as SortField)

      const params = new URLSearchParams(searchParams)
      params.set(SORT_SEARCH_PARAM_KEY, sortParam as SortField)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
      <div className="sort-column__buttons">
        <button
          type="button"
          className={`sort-column__asc sort-column__button  ${
            isAscActive ? 'sort-column--active' : ''
          }`}
          aria-label={`Sortieren nach ${label} Aufsteigend`}
          onClick={(e) => handleClick(e, '')}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={`sort-column__desc sort-column__button ${
            isDescActive ? 'sort-column--active' : ''
          }`}
          aria-label={`Sortieren nach ${label} Absteigend`}
          onClick={(e) => handleClick(e, '-')}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div id="learning-group-dashboard-table" className="table__wrap text-sm">
      <table className="table w-full">
        <thead className="table__header">
          <tr className="table__row">
            <th className="table__header-cell table__header-cell--sortable min-w-fit p-1 text-xs">
              <div className="sort-column">
                <span className="sort-column__label">
                  <span className="field-label unstyled">Vorname</span>
                </span>
                <SortButtons field="firstname" label="Vorname" />
              </div>
            </th>
            <th className="table__header-cell table__header-cell--sortable min-w-fit p-1 text-xs">
              <div className="sort-column">
                <span className="sort-column__label">
                  <span className="field-label unstyled">Nachname</span>
                </span>
                <SortButtons field="lastname" label="Nachname" />
              </div>
            </th>
            <th className="table__header-cell table__header-cell--sortable min-w-fit p-1 text-xs">
              <div className="sort-column">
                <span className="sort-column__label">
                  <span className="field-label unstyled">Level</span>
                </span>
                <SortButtons field="level" label="Level" />
              </div>
            </th>
            <th className="table__header-cell table__header-cell--sortable min-w-fit p-1 text-xs">
              <div className="sort-column">
                <span className="sort-column__label">
                  <span className="field-label unstyled">Lernort</span>
                </span>
                <SortButtons field="learningLocation" label="Lernort" />
              </div>
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
            sortedUsers.map((userWithTaskProgress) => {
              return (
                <tr
                  key={userWithTaskProgress.user.id}
                  className="table__row cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleRowClick(userWithTaskProgress)}
                >
                  <td className="table__cell p-1 min-w-fit text-xs">
                    {userWithTaskProgress.user.firstname || ''}
                  </td>
                  <td className="table__cell p-1 min-w-fit text-xs">
                    {userWithTaskProgress.user.lastname || ''}
                  </td>
                  <td className="table__cell min-w-fit p-1 text-xs">
                    <GraduationIcon
                      number={
                        userWithTaskProgress.user.graduation &&
                        typeof userWithTaskProgress.user.graduation === 'object'
                          ? userWithTaskProgress.user.graduation?.number
                          : 1
                      }
                      className="h-4 w-4"
                    />
                  </td>
                  <td className="table__cell p-1 min-w-fit text-xs">
                    {userWithTaskProgress.user.currentLearningLocation &&
                    typeof userWithTaskProgress.user.currentLearningLocation === 'object'
                      ? userWithTaskProgress.user.currentLearningLocation?.description
                      : '-'}
                  </td>
                  <td className="table__cell p-1 min-w-fit text-xs">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <Circle className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {userWithTaskProgress.amountOfNotStartedTasks}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-orange-600">
                          {userWithTaskProgress.progressTasksNames.length > 0 && (
                            <>{userWithTaskProgress.progressTasksNames.join(', ')}</>
                          )}
                          {userWithTaskProgress.progressTasksNames.length === 0 && (
                            <span className="text-xs text-orange-600">0</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-600">
                          {userWithTaskProgress.amountOfFinishedTasks}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="table__cell p-1 min-w-fit text-xs">
                    <div className="flex items-center gap-1">
                      {userWithTaskProgress.needHelpTasksNames.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <HelpCircle className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600">
                            {userWithTaskProgress.needHelpTasksNames.join(', ')}
                          </span>
                        </div>
                      )}
                      {userWithTaskProgress.searchPartnerTasksNames.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600">
                            {userWithTaskProgress.searchPartnerTasksNames.join(', ')}
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
      {selectedUser && (
        <TaskBoardComponent
          userWithTaskProgress={selectedUser}
          learningLocations={learningLocations}
          showAsModal={true}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
