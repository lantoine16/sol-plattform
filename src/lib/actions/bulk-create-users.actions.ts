'use server'

import { processBulkUserCreate } from '@/lib/services/create-users.service'
import { User } from '@/payload-types'
import type { UserRoleValue } from '@/domain/constants/user-role.constants'

export async function bulkCreateUsersAction(input: {
  bulkData: string
  learningGroup: string[] | null
  currentLearningLocation: string | null
  defaultLearningLocation: string | null
  role: UserRoleValue
  graduation: string | null
}): Promise<User[]> {
  if (!input.bulkData?.trim()) {
    throw new Error('Keine CSV-Daten angegeben')
  }

  return processBulkUserCreate({
    bulkData: input.bulkData,
    learningGroup: input.learningGroup,
    currentLearningLocation: input.currentLearningLocation,
    defaultLearningLocation: input.defaultLearningLocation,
    role: input.role,
    graduation: input.graduation,
  })
}
