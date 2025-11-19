'use server'

import { processLearningGroupsSubjectBulkCreate } from '@/lib/services/create-subjects-learning-groups.service'
import { Subject } from '@/payload-types'

export async function bulkCreateSubjectsAction(input: { bulkData: string }): Promise<Subject[]> {
  if (!input.bulkData?.trim()) {
    throw new Error('Keine Fächer angegeben')
  }

  return processLearningGroupsSubjectBulkCreate({
    collection: 'subjects',
    bulkData: input.bulkData,
    descriptionField: 'description',
  })
}
