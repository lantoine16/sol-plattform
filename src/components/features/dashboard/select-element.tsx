'use client'
import * as React from 'react'
import { useMemo, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import { ReactSelect, type ReactSelectOption } from '@payloadcms/ui'

export type Item = {
  id: string
  description: string
}

type SelectItemProps = {
  items: Item[]
  selectedId?: string
  searchParamName: string
  placeholder: string
  itemName: string
}

export function SelectElement({
  items,
  selectedId,
  searchParamName,
  placeholder,
  itemName,
}: SelectItemProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const options = useMemo<ReactSelectOption[]>(() => {
    return items.map((item) => ({
      label: item.description,
      value: item.id,
    }))
  }, [items])

  const selectedOption = useMemo(() => {
    if (!selectedId) {
      return undefined
    }
    return options.find((option) => option.value === selectedId)
  }, [options, selectedId])

  const handleSelectChange = useCallback(
    (option: ReactSelectOption | ReactSelectOption[] | null) => {
      const params = new URLSearchParams(searchParams)

      let value: string | undefined

      if (Array.isArray(option)) {
        value = option[0]?.value as string | undefined
      } else if (option) {
        value = option.value as string | undefined
      }

      if (!value || value === '0' || value === '') {
        params.delete(searchParamName)
      } else {
        params.set(searchParamName, value)
      }

      const query = params.toString()
      replace(query ? `${pathname}?${query}` : pathname)
    },
    [pathname, replace, searchParamName, searchParams],
  )

  return (
    <div className="min-w-[180px]">
      <ReactSelect
        className="react-select-dashboard"
        options={options}
        value={selectedOption}
        placeholder={placeholder}
        isClearable={false}
        onChange={handleSelectChange}
        customProps={{
          valueContainerLabel: itemName,
        }}
      />
    </div>
  )
}
