import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/data/payload-client'
import {
  USER_ROLE_ADMIN,
  USER_ROLE_TEACHER,
  USER_ROLE_PUPIL,
} from '@/domain/constants/user-role.constants'

export default async function RootPage() {
  const user = await getCurrentUser()
  if (user) {
    if (user.role === USER_ROLE_PUPIL) {
      redirect(`/taskboard`)
    } else if (user.role === USER_ROLE_ADMIN || user.role === USER_ROLE_TEACHER) {
      redirect(`/dashboard`)
    }
  }

  // If no user or unknown role, let Payload handle the route (will show login)
  // This should not happen if Payload routes are configured correctly,
  // but we keep it as fallback
  return null
}
