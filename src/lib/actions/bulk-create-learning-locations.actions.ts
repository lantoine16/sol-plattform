'use server'

import { processLearningGroupsLocationsBulkCreate } from '@/lib/services/create-subjects-learning-groups.service'

export async function bulkCreateLearningLocationsAction(input: {
  bulkData: string
}): Promise<any[]> {
  if (!input.bulkData?.trim()) {
    throw new Error('Keine Lernorte angegeben')
  }

  return processLearningGroupsLocationsBulkCreate({
    collection: 'learning-location',
    bulkData: input.bulkData,
  })
}
