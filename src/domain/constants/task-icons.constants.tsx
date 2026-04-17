import { HelpCircle, NotebookPen, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const TASK_ICONS = {
  helpNeeded: HelpCircle,
  readyForExam: NotebookPen,
  searchPartner: Users,
} as const satisfies Record<string, LucideIcon>






