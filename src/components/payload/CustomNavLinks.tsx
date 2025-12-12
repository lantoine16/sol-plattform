'use client'
import React from 'react'
import { NavGroup, Link, useAuth } from '@payloadcms/ui'
import { usePathname, useRouter } from 'next/navigation'
import {
  USER_ROLE_PUPIL,
  USER_ROLE_TEACHER,
  USER_ROLE_ADMIN,
} from '@/domain/constants/user-role.constants'

export const BeforeNavLinks = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const dashboardHref = '/dashboard'
  const detailViewHref = '/detailView'
  const taskBoardHref = '/taskboard'
  const isDashboardActive = pathname.includes(dashboardHref)
  const isDetailViewActive = pathname.includes(detailViewHref)
  const isTaskBoardActive = pathname.includes(taskBoardHref)

  return (
    <NavGroup label={'Ansichten'}>
      {user?.role === USER_ROLE_ADMIN || user?.role === USER_ROLE_TEACHER ? (
        <>
          <Link
            href={dashboardHref}
            className="nav__link"
            id="nav-dashboard"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              if (!isDashboardActive) {
                e.preventDefault()
                router.push(dashboardHref)
              }
            }}
            style={{
              cursor: isDashboardActive ? 'text' : 'pointer',
              pointerEvents: isDashboardActive ? 'none' : 'auto',
            }}
          >
            {isDashboardActive && <div className="nav__link-indicator" />}
            <span className="nav__link-label">Dashboard</span>
          </Link>
          <Link
            href={detailViewHref}
            className="nav__link"
            id="nav-detail-view"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              if (!isDetailViewActive) {
                e.preventDefault()
                router.push(detailViewHref)
              }
            }}
            style={{
              cursor: isDetailViewActive ? 'text' : 'pointer',
              pointerEvents: isDetailViewActive ? 'none' : 'auto',
            }}
          >
            {isDetailViewActive && <div className="nav__link-indicator" />}
            <span className="nav__link-label">Detailansicht</span>
          </Link>
        </>
      ) : null}
      {user?.role === USER_ROLE_ADMIN || user?.role === USER_ROLE_PUPIL ? (
        <Link
          href={taskBoardHref}
          className="nav__link"
          id="nav-task-board"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            if (!isTaskBoardActive) {
              e.preventDefault()
              router.push(taskBoardHref)
            }
          }}
          style={{
            cursor: isTaskBoardActive ? 'text' : 'pointer',
            pointerEvents: isTaskBoardActive ? 'none' : 'auto',
          }}
        >
          {isTaskBoardActive && <div className="nav__link-indicator" />}
          <span className="nav__link-label">Taskboard</span>
        </Link>
      ) : null}
    </NavGroup>
  )
}

export default BeforeNavLinks
