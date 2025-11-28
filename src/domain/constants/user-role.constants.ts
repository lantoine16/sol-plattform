export const USER_ROLE_OPTIONS = [
  {
    label: 'Schüler',
    value: 'pupil',
  },
  {
    label: 'Lehrer',
    value: 'teacher',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
] as const

export type UserRoleValue = (typeof USER_ROLE_OPTIONS)[number]['value']

export const USER_ROLE_DEFAULT_LABEL = USER_ROLE_OPTIONS[0].label // 'Schüler'
export const USER_ROLE_DEFAULT_VALUE = USER_ROLE_OPTIONS[0].value // 'pupil'

export const USER_ROLE_ADMIN = 'admin'
export const USER_ROLE_TEACHER = 'teacher'
export const USER_ROLE_PUPIL = 'pupil'

export const getRoleLabel = (value: string | null): string => {
  if (!value) return USER_ROLE_DEFAULT_LABEL
  const option = USER_ROLE_OPTIONS.find((opt) => opt.value === value)
  return option?.label || USER_ROLE_DEFAULT_LABEL
}
