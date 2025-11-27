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
import { StudentDetailsModal } from '@/components/features/student-details/student-details-modal'
import type { UserWithTaskProgress } from '@/lib/types'
import { useRouter } from 'next/navigation'
import type { LearningLocation } from '@/payload-types'
type SortField = 'firstname' | 'lastname'
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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter()
  // Sortierte Benutzerliste
  const sortedUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) => {
      let aValue = ''
      let bValue = ''

      if (sortField === 'firstname') {
        aValue = (a.user.firstname || '').toLowerCase()
        bValue = (b.user.firstname || '').toLowerCase()
      } else {
        aValue = (a.user.lastname || '').toLowerCase()
        bValue = (b.user.lastname || '').toLowerCase()
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

  const handleRowClick = (userWithTaskProgress: UserWithTaskProgressInformation) => {
    // Konvertiere UserWithTaskProgressInformation zu UserWithTaskProgress
    const userWithTaskProgressForModal: UserWithTaskProgress = {
      user: userWithTaskProgress.user,
      taskProgresses: userWithTaskProgress.taskProgresses,
    }
    setSelectedUser(userWithTaskProgressForModal)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
    router.refresh()
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
        <StudentDetailsModal
          userWithTaskProgress={selectedUser}
          learningLocations={learningLocations}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
