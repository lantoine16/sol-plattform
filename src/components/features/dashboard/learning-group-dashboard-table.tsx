'use client'

import { useMemo, useState } from 'react'
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
import { useRouter } from 'next/navigation'
import type { LearningLocation } from '@/payload-types'
type SortField = 'firstname' | 'lastname' | 'level' | 'learningLocation'
type SortDirection = 'asc' | 'desc'

export function LearningGroupDashboardTable({
  users,
  learningLocations,
}: {
  users: UserWithTaskProgressInformation[]
  learningLocations: LearningLocation[]
}) {
  const [sortField, setSortField] = useState<SortField>('lastname')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedUser, setSelectedUser] = useState<UserWithTaskProgress | null>(null)

  const router = useRouter()
  // Sortierte Benutzerliste
  const sortedUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      let aValue: string | number = ''
      let bValue: string | number = ''

      if (sortField === 'firstname') {
        aValue = (a.user.firstname || '').toLowerCase()
        bValue = (b.user.firstname || '').toLowerCase()
      } else if (sortField === 'lastname') {
        aValue = (a.user.lastname || '').toLowerCase()
        bValue = (b.user.lastname || '').toLowerCase()
      } else if (sortField === 'level') {
        // Sortiere nach Graduation Number
        aValue =
          a.user.graduation && typeof a.user.graduation === 'object'
            ? a.user.graduation.number || 1
            : 1
        bValue =
          b.user.graduation && typeof b.user.graduation === 'object'
            ? b.user.graduation.number || 1
            : 1
      } else if (sortField === 'learningLocation') {
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

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [users, sortField, sortDirection])

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
    const isActive = sortField === field
    const isAscActive = isActive && sortDirection === 'asc'
    const isDescActive = isActive && sortDirection === 'desc'

    const handleClick = (e: React.MouseEvent, sortDirection: SortDirection) => {
      e.stopPropagation()
      setSortField(field)
      setSortDirection(sortDirection)
    }

    return (
      <div className="sort-column__buttons">
        <button
          type="button"
          className={`sort-column__asc sort-column__button  ${
            isAscActive ? 'sort-column--active' : ''
          }`}
          aria-label={`Sortieren nach ${label} Aufsteigend`}
          onClick={(e) => handleClick(e, 'asc')}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={`sort-column__desc sort-column__button ${
            isDescActive ? 'sort-column--active' : ''
          }`}
          aria-label={`Sortieren nach ${label} Absteigend`}
          onClick={(e) => handleClick(e, 'desc')}
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
