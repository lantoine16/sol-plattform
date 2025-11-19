'use server'

import { processLearningGroupsSubjectBulkCreate } from '@/lib/services/create-subjects-learning-groups.service'
import { LearningGroup } from '@/payload-types'

export async function bulkCreateLearningGroupsAction(input: {
  bulkData: string
}): Promise<LearningGroup[]> {
  if (!input.bulkData?.trim()) {
    throw new Error('Keine Lerngruppen angegeben')
  }

  return processLearningGroupsSubjectBulkCreate({
    collection: 'learning-groups',
    bulkData: input.bulkData,
    descriptionField: 'description',
  })
}
