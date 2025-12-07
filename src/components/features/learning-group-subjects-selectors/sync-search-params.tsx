// src/components/features/learning-group-subjects-selectors/sync-search-params.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import {
  LEARNING_GROUP_SEARCH_PARAM_KEY,
  SUBJECT_SEARCH_PARAM_KEY,
} from '@/domain/constants/search-param-keys.constants'

/**
 * Syncs the search params with the selected learning group and subject ids from the preferences
 * @param subjectSearchParams - The selected subject ids
 * @param learningGroupSearchParam - The selected learning group id
 * @returns null
 */
export default function SyncSearchParams({
  subjectSearchParams,
  learningGroupSearchParam,
}: {
  subjectSearchParams: string[] | undefined
  learningGroupSearchParam: string[] | undefined
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasSynced = useRef(false)

  useEffect(() => {
    // Nur einmal beim Mount synchronisieren
    if (hasSynced.current) return

    //get the current search params
    const params = new URLSearchParams(searchParams)

    // delete the learning group search param if it exists
    params.delete(LEARNING_GROUP_SEARCH_PARAM_KEY)
    // set the learning group search param if it exists
    learningGroupSearchParam &&
      learningGroupSearchParam.length > 0 &&
      params.set(LEARNING_GROUP_SEARCH_PARAM_KEY, learningGroupSearchParam[0])
    // delete the subject search params if they exist
    params.delete(SUBJECT_SEARCH_PARAM_KEY)
    // set the subject search params if they exist
    subjectSearchParams?.forEach((id) => params.append(SUBJECT_SEARCH_PARAM_KEY, id))
    // replace the search params without scrolling to the top of the page
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [router, pathname])

  return null
}
