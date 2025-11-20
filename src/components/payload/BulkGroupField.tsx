'use client'

const description = (namePlural: string) =>
  'Geben Sie die Namen der ' + namePlural + ' ein, eine pro Zeile. Leere Zeilen werden ignoriert.'
const placeholder = (nameSingular: string) =>
  `${nameSingular} 1 \n${nameSingular} 2 \n${nameSingular} 3`

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'

export const BulkUserField: React.FC = () => {
  const description = `Geben Sie die Benutzerdaten im CSV-Format ein: Nachname,Vorname, Passwort, Email, Benutzername.
  Email und Benutzername sind optional. Falls kein Benutzername angegeben wird vorname.nachname als benutzername gesetzt. 
  Pro Benutzer eine Zeile. Leere Zeilen werden ignoriert.`
  const placeholder = `Mustermann, Max, password, max.mustermann@schule.de, max.mustermann
Schmidt, Anna, pass456, anna.schmidt@schule.de, anna.schmidt
Meier, Peter, pass789, peter.meier@schule.de, peter.meier`
  return <BulkGroupField title={'Benutzer'} description={description} placeholder={placeholder} />
}
// Wrapper-Komponente für LearningGroups mit Labels aus der Collection-Konfiguration
export const BulkLearningGroupField: React.FC = () => {
  return (
    <BulkGroupField
      title={'Lerngruppen'}
      description={description('Lerngruppen')}
      placeholder={placeholder('Lerngruppe')}
    />
  )
}

// Wrapper-Komponente für Subjects mit Labels aus der Collection-Konfiguration
export const BulkSubjectField: React.FC = () => {
  return (
    <BulkGroupField
      title={'Fächer'}
      description={description('Fächer')}
      placeholder={placeholder('Fach')}
    />
  )
}

// Wrapper-Komponente für Tasks mit Labels aus der Collection-Konfiguration
export const BulkTaskField: React.FC = () => {
  return (
    <BulkGroupField
      title={'Aufgaben'}
      description={description('Aufgaben')}
      placeholder={placeholder('Aufgabe')}
    />
  )
}

// Generische Komponente für Bulk-Erstellung
export const BulkGroupField: React.FC<{
  title: string
  description: string
  placeholder: string
}> = ({ title, description, placeholder }) => {
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
          {title}
          <span className="required">*</span>
        </label>
        <p className="field-description" style={{ whiteSpace: 'pre-line' }}>
          {description}
        </p>
        <div className="field-type textarea">
          <textarea
            id="bulk-groups-input"
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              setInputValue(e.target.value)
            }}
            placeholder={placeholder}
            rows={8}
          />
        </div>
      </div>
    </div>
  )
}
