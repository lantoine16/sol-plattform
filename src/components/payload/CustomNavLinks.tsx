'use client'
import React from 'react'
import { NavGroup, Link } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

export const BeforeNavLinks = () => {
  const pathname = usePathname()
  const dashboardHref = '/dashboard'
  const detailViewHref = '/detailView'
  const taskBoardHref = '/taskboard'
  const isDashboardActive = pathname.includes(dashboardHref)
  const isDetailViewActive = pathname.includes(detailViewHref)
  const isTaskBoardActive = pathname.includes(taskBoardHref)
  return (
    <NavGroup label={'Ansichten'}>
      <Link
        href={dashboardHref}
        className="nav__link"
        id="nav-dashboard"
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
        style={{
          cursor: isDetailViewActive ? 'text' : 'pointer',
          pointerEvents: isDetailViewActive ? 'none' : 'auto',
        }}
      >
        {isDetailViewActive && <div className="nav__link-indicator" />}
        <span className="nav__link-label">Detailansicht</span>
      </Link>
      <Link
        href={taskBoardHref}
        className="nav__link"
        id="nav-task-board"
        style={{
          cursor: isTaskBoardActive ? 'text' : 'pointer',
          pointerEvents: isTaskBoardActive ? 'none' : 'auto',
        }}
      >
        {isTaskBoardActive && <div className="nav__link-indicator" />}
        <span className="nav__link-label">Taskboard</span>
      </Link>
    </NavGroup>
  )
}

export default BeforeNavLinks
