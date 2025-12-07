import { useMemo } from 'react'
import { SelectElement, type Item } from '@/components/ui/select-element'
import type { LearningGroup, Subject } from '@/payload-types'
import { SELECTED_LEARNING_GROUP_PREFERENCE_KEY, SELECTED_SUBJECTS_PREFERENCE_KEY } from '@/domain/constants/preferences-keys.constants'
import { LEARNING_GROUP_SEARCH_PARAM_KEY, SUBJECT_SEARCH_PARAM_KEY } from '@/domain/constants/search-param-keys.constants'

type LearningGroupSubjectsSelectorsProps = {
  learningGroups: LearningGroup[]
  subjects: Subject[]
  selectedLearningGroupId?: string[] 
  selectedSubjectIds?: string[] 
  showLearningGroupSelector?: boolean
}

export function LearningGroupSubjectsSelectors({
  learningGroups,
  subjects,
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
        searchParamName={LEARNING_GROUP_SEARCH_PARAM_KEY}
        preferenceKey={SELECTED_LEARNING_GROUP_PREFERENCE_KEY}
        itemName="Lerngruppe"
        isMulti={false}
      />
      )}
      <SelectElement
        items={subjectItems}
        selectedIds={selectedSubjectIds}
        placeholder="Wähle ein Fach"
        searchParamName={SUBJECT_SEARCH_PARAM_KEY}
        preferenceKey={SELECTED_SUBJECTS_PREFERENCE_KEY}
        itemName="Fach"
        isMulti={true}
      />
    </div>
  )
}
