export const SUBJECT_COLOR_OPTIONS = [
  {
    label: 'Blau',
    value: 'blue',
    colors: {
      light: '#DBEAFE', // blue-100 (kräftiger)
      dark: '#1D4ED8', // blue-700 (kräftiger)
    },
  },
  {
    label: 'Grün',
    value: 'green',
    colors: {
      light: '#DCFCE7', // green-100 (kräftiger)
      dark: '#15803D', // green-700 (kräftiger)
    },
  },
  {
    label: 'Gelb',
    value: 'yellow',
    colors: {
      light: '#FEF9C3', // yellow-100 (kräftiger)
      dark: '#A16207', // yellow-700 (kräftiger)
    },
  },
  {
    label: 'Orange',
    value: 'orange',
    colors: {
      light: '#FFEDD5', // orange-100 (kräftiger)
      dark: '#C2410C', // orange-700 (kräftiger)
    },
  },
  {
    label: 'Rot',
    value: 'red',
    colors: {
      light: '#FEE2E2', // red-100 (kräftiger)
      dark: '#B91C1C', // red-700 (kräftiger)
    },
  },
  {
    label: 'Violett',
    value: 'violet',
    colors: {
      light: '#EDE9FE', // violet-100 (kräftiger)
      dark: '#6D28D9', // violet-700 (kräftiger)
    },
  },
  {
    label: 'Pink',
    value: 'pink',
    colors: {
      light: '#FCE7F3', // pink-100 (kräftiger)
      dark: '#BE185D', // pink-700 (kräftiger)
    },
  },
  {
    label: 'Cyan',
    value: 'cyan',
    colors: {
      light: '#CFFAFE', // cyan-100 (kräftiger)
      dark: '#0E7490', // cyan-700 (kräftiger)
    },
  },
  {
    label: 'Lime',
    value: 'lime',
    colors: {
      light: '#ECFCCB', // lime-100 (kräftiger)
      dark: '#4D7C0F', // lime-700 (kräftiger)
    },
  },
  {
    label: 'Indigo',
    value: 'indigo',
    colors: {
      light: '#E0E7FF', // indigo-100 (kräftiger)
      dark: '#4338CA', // indigo-700 (kräftiger)
    },
  },
  {
    label: 'Türkis',
    value: 'teal',
    colors: {
      light: '#CCFBF1', // teal-100 (etwas schwächer)
      dark: '#0F766E', // teal-700 (etwas schwächer)
    },
  },
  {
    label: 'Lila',
    value: 'purple',
    colors: {
      light: '#F3E8FF', // purple-100 (kräftiger)
      dark: '#7E22CE', // purple-700 (kräftiger)
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
