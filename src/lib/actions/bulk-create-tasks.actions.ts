'use server'

import {
  processBlockTaskCreate,
  type BlockTaskCreateOptions,
} from '@/lib/services/create-tasks.service'
import { Task } from '@/payload-types'

export async function blockCreateTasksAction(input: BlockTaskCreateOptions): Promise<Task[]> {
  if (!input.blocks || input.blocks.length === 0) {
    throw new Error('Keine Aufgaben-Blöcke angegeben')
  }

  if (!input.subject) {
    throw new Error('Kein Fach ausgewählt')
  }

  return processBlockTaskCreate({
    blocks: input.blocks,
    subject: input.subject,
    learningGroup: input.learningGroup ?? null,
    user: input.user ?? null,
  })
}
