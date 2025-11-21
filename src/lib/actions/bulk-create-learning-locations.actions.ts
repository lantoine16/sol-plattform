'use server'

import { processLearningGroupsSubjectBulkCreate } from '@/lib/services/create-subjects-learning-groups.service'

export async function bulkCreateLearningLocationsAction(input: {
  bulkData: string
}): Promise<any[]> {
  if (!input.bulkData?.trim()) {
    throw new Error('Keine Lernorte angegeben')
  }

  return processLearningGroupsSubjectBulkCreate({
    collection: 'learning-location',
    bulkData: input.bulkData,
    descriptionField: 'description',
  })
}

