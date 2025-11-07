'use client'
import * as React from 'react'
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
  id: number
  description: string
}

type SelectItemProps = {
  items: Item[]
  selectedId?: number
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

  const handleChange = (id: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(searchParamName, String(id))
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select
      onValueChange={handleChange}
      defaultValue={selectedId !== undefined ? String(selectedId) : items[0]?.id.toString()}
    >
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

