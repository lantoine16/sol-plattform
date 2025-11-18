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
    label: 'Fertig',
    value: 'finished',
  },
] as const

export type TaskStatusValue = (typeof TASK_STATUS_OPTIONS)[number]['value']

export const TASK_PROGRESS_DEFAULT_STATUS_LABEL = TASK_STATUS_OPTIONS[0].label
export const TASK_PROGRESS_DEFAULT_STATUS_VALUE = TASK_STATUS_OPTIONS[0].value

export const getStatusLabel = (value: string | null): string => {
  if (!value) return TASK_PROGRESS_DEFAULT_STATUS_LABEL
  const option = TASK_STATUS_OPTIONS.find((opt) => opt.value === value)
  return option?.label || TASK_PROGRESS_DEFAULT_STATUS_LABEL
}
