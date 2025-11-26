import { GraduationIcon } from '@/components/ui/graduation-icon'
import type { LucideProps } from 'lucide-react'

export const USER_GRADUATION_OPTIONS = [
  {
    label: 'Neustarter',
    value: 'newcomer',
    icon: (props: LucideProps) => <GraduationIcon number={1} {...props} />,
  },
  {
    label: 'Starter',
    value: 'starter',
    icon: (props: LucideProps) => <GraduationIcon number={2} {...props} />,
  },
  {
    label: 'Lernprofi',
    value: 'learning-pro',
    icon: (props: LucideProps) => <GraduationIcon number={3} {...props} />,
  },
  {
    label: 'Durchstarter',
    value: 'high-achiever',
    icon: (props: LucideProps) => <GraduationIcon number={4} {...props} />,
  },
] as const

export type UserGraduationValue = (typeof USER_GRADUATION_OPTIONS)[number]['value']

export const USER_GRADUATION_DEFAULT_LABEL = USER_GRADUATION_OPTIONS[0].label // 'Neustarter'
export const USER_GRADUATION_DEFAULT_VALUE = USER_GRADUATION_OPTIONS[0].value // 'newcomer'

export const getGraduationLabel = (value: string | null): string => {
  if (!value) return USER_GRADUATION_DEFAULT_LABEL
  const option = USER_GRADUATION_OPTIONS.find((opt) => opt.value === value)
  return option?.label || USER_GRADUATION_DEFAULT_LABEL
}

export const getGraduationIcon = (value: string | null) => {
  if (!value) return USER_GRADUATION_OPTIONS[0].icon
  const option = USER_GRADUATION_OPTIONS.find((opt) => opt.value === value)
  return option?.icon || USER_GRADUATION_OPTIONS[0].icon
}
