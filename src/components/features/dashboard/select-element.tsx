'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

  // Aktualisiere den State, wenn sich selectedId oder items ändern
  useEffect(() => {
    if (selectedId !== undefined && selectedId !== '0') {
      // Prüfe, ob der selectedId in den items vorhanden ist, wenn ja ist alles in Ordnung
      if (items.find((item) => item.id === selectedId)) {
        setProovedSelectedId(selectedId)
        return
      }
    }
    const newSelectedId = items[0]?.id || ''
    // wenn die neue SelectedId nicht der aktuellen SelectedId ist, dann update diese in den SearchParams
    // es sollte der erste in den Items die ID 0 haben und daher wird der SearchParam gelöscht
    if (newSelectedId !== proovedSelectedId) {
      handleChange(newSelectedId)
    }
    setProovedSelectedId(newSelectedId)
  }, [selectedId, items])

  const handleChange = (id: string) => {
    const params = new URLSearchParams(searchParams)
    if (id === '0') {
      // Remove the search param to clear selection
      params.delete(searchParamName)
    } else {
      params.set(searchParamName, String(id))
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={proovedSelectedId} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{itemName}</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.id} value={String(item.id)}>
              {item.description}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
