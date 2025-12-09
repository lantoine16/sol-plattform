'use server'

import { processLearningGroupsLocationsBulkCreate } from '@/lib/services/create-subjects-learning-groups.service'
import { LearningGroup } from '@/payload-types'

export async function bulkCreateLearningGroupsAction(input: {
  bulkData: string
}): Promise<LearningGroup[]> {
  if (!input.bulkData?.trim()) {
    throw new Error('Keine Lerngruppen angegeben')
  }

  return processLearningGroupsLocationsBulkCreate({
    collection: 'learning-groups',
    bulkData: input.bulkData,
  })
}
