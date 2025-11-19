'use server'

import {
  processBulkTaskCreate,
  type BulkTaskCreateOptions,
} from '@/lib/services/bulk-create.service'
import { Task } from '@/payload-types'

export async function bulkCreateTasksAction(input: BulkTaskCreateOptions): Promise<Task[]> {
  if (!input.bulkData?.trim()) {
    throw new Error('Keine Aufgaben angegeben')
  }

  if (!input.subject) {
    throw new Error('Kein Fach ausgewählt')
  }

  return processBulkTaskCreate({
    bulkData: input.bulkData,
    subject: input.subject,
    learningGroup: input.learningGroup ?? null,
    user: input.user ?? null,
  })
}
