'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'

// Wrapper-Komponente für LearningGroups mit Labels aus der Collection-Konfiguration
export const BulkLearningGroupField: React.FC = () => {
  return <BulkGroupField labelSingular={'Lerngruppe'} labelPlural={'Lerngruppen'} />
}

// Wrapper-Komponente für Subjects mit Labels aus der Collection-Konfiguration
export const BulkSubjectField: React.FC = () => {
  return <BulkGroupField labelSingular={'Fach'} labelPlural={'Fächer'} />
}

// Wrapper-Komponente für Tasks mit Labels aus der Collection-Konfiguration
export const BulkTaskField: React.FC = () => {
  return <BulkGroupField labelSingular={'Aufgabe'} labelPlural={'Aufgaben'} />
}

// Generische Komponente für Bulk-Erstellung
export const BulkGroupField: React.FC<{ labelSingular: string; labelPlural: string }> = ({
  labelSingular,
  labelPlural,
}) => {
  const { value: bulkCreateData, setValue } = useField<string>({ path: 'bulkCreateData' })
  const [inputValue, setInputValue] = useState(bulkCreateData || '')

  // Speichere die Textarea-Daten im versteckten bulkCreateData-Feld
  useEffect(() => {
    setValue(inputValue)
  }, [inputValue, setValue])

  return (
    <div className="field-type">
      <div className="field-type__wrap">
        <label htmlFor="bulk-groups-input" className="field-label">
          {labelPlural} 
          <span className="required">*</span>
        </label>
        <p className="field-description">
          Geben Sie die Namen der {labelPlural} ein, eine pro Zeile. Leere Zeilen werden ignoriert.
        </p>
        <div className="field-type textarea">
          <textarea
            id="bulk-groups-input"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setInputValue(e.target.value)
            }}
            placeholder={`${labelSingular} 1 \n${labelSingular} 2 \n${labelSingular} 3`}
            rows={8}
          />
        </div>
      </div>
    </div>
  )
}
