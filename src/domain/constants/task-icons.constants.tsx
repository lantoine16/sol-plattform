import { HelpCircle, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const TASK_ICONS = {
  helpNeeded: HelpCircle,
  searchPartner: Users,
} as const satisfies Record<string, LucideIcon>






