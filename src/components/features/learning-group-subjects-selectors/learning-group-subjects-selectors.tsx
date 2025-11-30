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
  showLearningGroupSelector?: boolean
}

export function LearningGroupSubjectsSelectors({
  learningGroups,
  subjects,
  learningGroupSearchParamName,
  subjectSearchParamName,
  selectedLearningGroupId,
  selectedSubjectIds,
  showLearningGroupSelector = true,
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
    <div className="flex flex-row items-center flex-wrap gap-2">
      {showLearningGroupSelector && (
      <SelectElement
        items={learningGroupItems}
        selectedIds={selectedLearningGroupId}
        placeholder="Wähle eine Lerngruppe"
        searchParamName={learningGroupSearchParamName}
        itemName="Lerngruppe"
        isMulti={false}
      />
      )}
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
