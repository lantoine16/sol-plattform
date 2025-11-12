'use client'
import * as React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import { ReactSelect, type ReactSelectOption } from '@payloadcms/ui'

type Item = {
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

  // State für den aktuellen Wert, damit die UI direkt auf Änderungen reagiert
  const [proovedSelectedId, setProovedSelectedId] = useState<string>('0')

  const options = useMemo<ReactSelectOption[]>(() => {
    return items.map((item) => ({
      label: item.description,
      value: item.id,
    }))
  }, [items])

  const updateSelection = useCallback(
    (id: string, { syncParams = true }: { syncParams?: boolean } = {}) => {
      setProovedSelectedId(id)

      if (!syncParams) {
        return
      }

      const params = new URLSearchParams(searchParams)
      if (id === '0' || id === '') {
        params.delete(searchParamName)
      } else {
        params.set(searchParamName, String(id))
      }

      const query = params.toString()
      replace(query ? `${pathname}?${query}` : pathname)
    },
    [pathname, replace, searchParamName, searchParams],
  )

  // Aktualisiere den State, wenn sich selectedId oder items ändern
  useEffect(() => {
    if (selectedId !== undefined && selectedId !== '0') {
      // Prüfe, ob der selectedId in den items vorhanden ist, wenn ja ist alles in Ordnung
      if (items.find((item) => item.id === selectedId)) {
        if (selectedId !== proovedSelectedId) {
          updateSelection(selectedId, { syncParams: false })
        }
        return
      }
    }
    const newSelectedId = items[0]?.id || ''
    // wenn die neue SelectedId nicht der aktuellen SelectedId ist, dann update diese in den SearchParams
    // es sollte der erste in den Items die ID 0 haben und daher wird der SearchParam gelöscht
    if (newSelectedId !== proovedSelectedId) {
      updateSelection(newSelectedId)
    }
  }, [items, proovedSelectedId, selectedId, updateSelection])

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === proovedSelectedId)
  }, [options, proovedSelectedId])

  const handleSelectChange = (option: ReactSelectOption | ReactSelectOption[]) => {
    if (Array.isArray(option)) {
      const firstValue = option[0]?.value
      const nextValue =
        typeof firstValue === 'string'
          ? firstValue
          : String((firstValue as string | number | undefined) ?? '0')
      updateSelection(nextValue)
      return
    }

    const value = option?.value
    const nextValue =
      typeof value === 'string' ? value : String((value as string | number | undefined) ?? '0')
    updateSelection(nextValue)
  }

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
