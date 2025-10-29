import * as React from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import config from '@/payload.config'
import { getPayload } from 'payload'
export async function SelectClass() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const classes = await payload.find({
    collection: 'classes',
    sort: 'description',
  })
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Wähle eine Klasse" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Klasse</SelectLabel>
          {classes.docs.map((classItem) => (
            <SelectItem key={classItem.id} value={classItem.description}>
              {classItem.description}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
