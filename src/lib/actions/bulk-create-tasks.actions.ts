'use server'

import { processBlockTaskCreate } from '@/lib/services/create-tasks.service'
import { Task } from '@/payload-types'
import { CreateTaskData } from '../types'

export async function blockCreateTasksAction(input: CreateTaskData): Promise<Task[]> {
  if (!input.blocks || input.blocks.length === 0) {
    throw new Error('Keine Aufgaben-Blöcke angegeben')
  }

  if (!input.subject) {
    throw new Error('Kein Fach ausgewählt')
  }

  return processBlockTaskCreate({
    blocks: input.blocks,
    subject: input.subject,
    learningGroups: input.learningGroups ?? null,
    users: input.users ?? null,
  })
}
