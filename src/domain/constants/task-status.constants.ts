export const TASK_STATUS_OPTIONS = [
  {
    label: 'Nicht begonnen',
    value: 'not-started',
  },
  {
    label: 'In Bearbeitung',
    value: 'in-progress',
  },
  {
    label: 'Benötige Hilfe',
    value: 'need-help',
  },
  {
    label: 'Fertig',
    value: 'finished',
  },
] as const

export type TaskStatusValue = (typeof TASK_STATUS_OPTIONS)[number]['value']

export const TASK_PROGRESS_DEFAULT_STATUS = TASK_STATUS_OPTIONS[0].label

export const getStatusLabel = (value: string | null): string => {
  if (!value) return TASK_PROGRESS_DEFAULT_STATUS
  const option = TASK_STATUS_OPTIONS.find((opt) => opt.value === value)
  return option?.label || TASK_PROGRESS_DEFAULT_STATUS
}
