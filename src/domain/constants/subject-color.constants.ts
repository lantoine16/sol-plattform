export const SUBJECT_COLOR_OPTIONS = [
  {
    label: 'Blau',
    value: 'blue',
    colors: {
      light: '#DBEAFE', // blue-100 (kräftiger)
      dark: '#3B82F6', // blue-500 (heller für Darkmode)
    },
  },
  {
    label: 'Grün',
    value: 'green',
    colors: {
      light: '#DCFCE7', // green-100 (kräftiger)
      dark: '#22C55E', // green-500 (heller für Darkmode)
    },
  },
  {
    label: 'Gelb',
    value: 'yellow',
    colors: {
      light: '#FEF9C3', // yellow-100 (kräftiger)
      dark: '#EAB308', // yellow-500 (heller für Darkmode)
    },
  },
  {
    label: 'Orange',
    value: 'orange',
    colors: {
      light: '#FFEDD5', // orange-100 (kräftiger)
      dark: '#F97316', // orange-500 (heller für Darkmode)
    },
  },
  {
    label: 'Rot',
    value: 'red',
    colors: {
      light: '#FEE2E2', // red-100 (kräftiger)
      dark: '#EF4444', // red-500 (heller für Darkmode)
    },
  },
  {
    label: 'Violett',
    value: 'violet',
    colors: {
      light: '#EDE9FE', // violet-100 (kräftiger)
      dark: '#8B5CF6', // violet-500 (heller für Darkmode)
    },
  },
  {
    label: 'Pink',
    value: 'pink',
    colors: {
      light: '#FCE7F3', // pink-100 (kräftiger)
      dark: '#EC4899', // pink-500 (heller für Darkmode)
    },
  },
  {
    label: 'Cyan',
    value: 'cyan',
    colors: {
      light: '#CFFAFE', // cyan-100 (kräftiger)
      dark: '#06B6D4', // cyan-500 (heller für Darkmode)
    },
  },
  {
    label: 'Lime',
    value: 'lime',
    colors: {
      light: '#ECFCCB', // lime-100 (kräftiger)
      dark: '#84CC16', // lime-500 (heller für Darkmode)
    },
  },
  {
    label: 'Indigo',
    value: 'indigo',
    colors: {
      light: '#E0E7FF', // indigo-100 (kräftiger)
      dark: '#6366F1', // indigo-500 (heller für Darkmode)
    },
  },
  {
    label: 'Türkis',
    value: 'teal',
    colors: {
      light: '#CCFBF1', // teal-100 (etwas schwächer)
      dark: '#14B8A6', // teal-500 (heller für Darkmode)
    },
  },
  {
    label: 'Lila',
    value: 'purple',
    colors: {
      light: '#F3E8FF', // purple-100 (kräftiger)
      dark: '#A855F7', // purple-500 (heller für Darkmode)
    },
  },
] as const

export type SubjectColorValue = (typeof SUBJECT_COLOR_OPTIONS)[number]['value']
export type SubjectColorOption = (typeof SUBJECT_COLOR_OPTIONS)[number]

/**
 * Gibt die Farbe für einen Subject-Color-Wert zurück
 * @param colorValue - Der Farbwert (z.B. 'blue', 'green')
 * @param isDarkMode - Ob Dark Mode aktiv ist
 * @returns Die entsprechende Farbe
 */
export function getSubjectColor(
  colorValue: string | null | undefined,
  isDarkMode: boolean = false,
): string {
  if (!colorValue) {
    return isDarkMode ? '#1F2937' : '#F9FAFB' // Standard-Grau
  }
  const option = SUBJECT_COLOR_OPTIONS.find((opt) => opt.value === colorValue)
  if (!option) {
    return isDarkMode ? '#1F2937' : '#F9FAFB' // Standard-Grau
  }
  return isDarkMode ? option.colors.dark : option.colors.light
}
