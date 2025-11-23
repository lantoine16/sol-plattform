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
  selectedIds?: string | string[]
  searchParamName: string
  placeholder: string
  itemName: string
  isMulti?: boolean
}

export function SelectElement({
  items,
  selectedIds,
  searchParamName,
  placeholder,
  itemName,
  isMulti,
}: SelectItemProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const options: ReactSelectOption[] = useMemo(() => {
    return items.map((item) => ({
      label: item.description,
      value: item.id,
    }))
  }, [items])

  const handleSelectChange = useCallback(
    (option: ReactSelectOption | ReactSelectOption[] | null) => {
      const params = new URLSearchParams(searchParams)

      // Entferne alle bestehenden Werte für diesen Parameter
      params.delete(searchParamName)
      //hänge bei multi select leeren string wenn option null oder empty array ist, sodass nicht alle ausgewählt werden in DashboardView
      if( isMulti && (option === null ||  option.length === 0 )) {
        params.append(searchParamName, '')
      }
      // Wenn option ein Array ist (Multi-Select)
      if (Array.isArray(option) && option.length > 0) {
        option.forEach((opt) => {
          const value = opt.value as string
          if (value && value !== '0' && value !== '') {
            params.append(searchParamName, value)
          }
        })
      } else if (option && !Array.isArray(option)) {
        // Einzelner Wert (für Rückwärtskompatibilität)
        const value = option.value as string
        if (value && value !== '0' && value !== '') {
          params.set(searchParamName, value)
        }
      }
      // Wenn option null ist, bleibt der Parameter gelöscht (leer)

      const query = params.toString()
      replace(query ? `${pathname}?${query}` : pathname)
    },
    [pathname, replace, searchParamName, searchParams],
  )

  const selectedOptions = useMemo(() => {
    if(isMulti) {
      return options.filter((option) => selectedIds?.includes(option.value as string))
    }
    // Wenn selectedId ein String ist (für Rückwärtskompatibilität)
    const option = options.find((option) => option.value === selectedIds)
    return option ? [option] : []
  }, [options])



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
        value={selectedOptions}
        customProps={{
          valueContainerLabel: itemName,
        }}
      />
    </div>
  )
}
