import { useMemo } from 'react'
import { SelectElement, type Item } from '@/components/ui/select-element'
import type { LearningGroup, Subject } from '@/payload-types'

type LearningGroupSubjectsSelectorsProps = {
  learningGroups: LearningGroup[]
  subjects: Subject[]
  learningGroupSearchParamName: string
  subjectSearchParamName: string
  selectedLearningGroupId: string | undefined
  selectedSubjectIds: string[]
}

export function LearningGroupSubjectsSelectors({
  learningGroups,
  subjects,
  learningGroupSearchParamName,
  subjectSearchParamName,
  selectedLearningGroupId,
  selectedSubjectIds,
}: LearningGroupSubjectsSelectorsProps) {
  const learningGroupItems: Item[] = useMemo(
    () =>
      learningGroups.map((learningGroup) => ({
        id: learningGroup.id,
        description: learningGroup.description || '',
      })),
    [learningGroups],
  )

  const subjectItems: Item[] = useMemo(
    () =>
      subjects.map((subject) => ({
        id: subject.id,
        description: subject.description || '',
      })),
    [subjects],
  )

  return (
    <div className="flex flex-row items-center flex-wrap px-4 gap-2">
      <SelectElement
        items={learningGroupItems}
        selectedIds={selectedLearningGroupId}
        placeholder="Wähle eine Lerngruppe"
        searchParamName={learningGroupSearchParamName}
        itemName="Lerngruppe"
        isMulti={false}
      />
      <SelectElement
        items={subjectItems}
        selectedIds={selectedSubjectIds}
        placeholder="Wähle ein Fach"
        searchParamName={subjectSearchParamName}
        itemName="Fach"
        isMulti={true}
      />
    </div>
  )
}
