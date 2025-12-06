'use client'

const description = (namePlural: string) =>
  'Geben Sie die Namen der ' + namePlural + ' ein, eine pro Zeile. Leere Zeilen werden ignoriert.'
const placeholder = (nameSingular: string) =>
  `${nameSingular} 1 \n${nameSingular} 2 \n${nameSingular} 3`

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'

export const BulkUserField: React.FC = () => {
  const description = `Geben Sie die Benutzerdaten im CSV-Format ein. Pro Benutzer eine Zeile: 
    Nachname,Vorname, Passwort, Email, Benutzername

  Passwort, Email und Benutzername sind optional und können leer gelassen werden. 
  Falls kein Passwort angegeben wird, wird ein zufälliges Passwort generiert.
  Falls keine Email angegeben wird, wird keine Email gesetzt.
  Falls kein Benutzername angegeben wird, wird vorname.nachname als benutzername gesetzt (bei mehrern Vor- oder Nachnamen wird jeweils der erste genommen). 
  
  `
  const placeholder = `Mustermann, Max, passwort123, max.mustermann@schule.de, max.mustermann
Schmidt, Anna, passwort456, anna.schmidt@schule.de, anna.schmidt
Meier, Peter, passwort789, peter.meier@schule.de, peter.meier`
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

// Wrapper-Komponente für LearningLocations mit Labels aus der Collection-Konfiguration
export const BulkLearningLocationField: React.FC = () => {
  return (
    <BulkGroupField
      title={'Lernorte'}
      description={description('Lernorte')}
      placeholder={placeholder('Lernort')}
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
