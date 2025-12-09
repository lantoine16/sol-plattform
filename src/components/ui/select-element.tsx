'use client'
import * as React from 'react'
import { useMemo, useCallback, useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import { ReactSelect, type ReactSelectOption, usePreferences } from '@payloadcms/ui'

export type Item = {
  id: string
  description: string
}

type SelectItemProps = {
  items: Item[]
  selectedIds?: string[]
  searchParamName: string
  preferenceKey: string
  placeholder: string
  itemName: string
  isMulti?: boolean
}

export function SelectElement({
  items,
  selectedIds,
  searchParamName,
  preferenceKey,
  placeholder,
  itemName,
  isMulti,
}: SelectItemProps) {
  const { setPreference } = usePreferences()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [selectedOptionsState, setSelectedOptionsState] = useState<
    ReactSelectOption | ReactSelectOption[] | undefined
  >(undefined)

  const options: ReactSelectOption[] = useMemo(() => {
    return items.map((item) => ({
      label: item.description,
      value: item.id,
    }))
  }, [items])

  useEffect(() => {
    if (selectedIds) {
      setSelectedOptionsFromSelectedIds(selectedIds)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds])

  const setSelectedOptionsFromSelectedIds = (selectedIds: string[]) => {
    const selected = options.filter((option) => selectedIds?.includes(option.value as string))
    setSelectedOptionsState(selected)
  }

  const handleSelectChange = useCallback(
    (option: ReactSelectOption | ReactSelectOption[] | undefined) => {
      if (option && typeof option === 'object' && !Array.isArray(option)) {
        option = [option]
      }
      const params = new URLSearchParams(searchParams)
      // Entferne alle bestehenden Werte für diesen Parameter
      params.delete(searchParamName)

      if (option) {
        const selectedIds: string[] = []
        option.forEach((opt) => {
          const value = opt.value as string
          selectedIds.push(value)
          params.append(searchParamName, value)
        })
        if (option.length === 0) {
          params.append(searchParamName, '')
        }
        setSelectedOptionsFromSelectedIds(selectedIds)
        setPreference(preferenceKey, selectedIds)
      }

      const query = params.toString()
      replace(query ? `${pathname}?${query}` : pathname)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, replace, searchParamName, searchParams, preferenceKey, setPreference],
  )

  return (
    <div>
      <ReactSelect
        className="react-select-container"
        options={options}
        placeholder={placeholder}
        isMulti={isMulti}
        isClearable={isMulti}
        isSearchable={true}
        onChange={handleSelectChange}
        value={selectedOptionsState}
        customProps={{
          valueContainerLabel: itemName,
        }}
      />
    </div>
  )
}
