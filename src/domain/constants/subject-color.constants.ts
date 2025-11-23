export const SUBJECT_COLOR_OPTIONS = [
  {
    label: 'Blau',
    value: 'blue',
    colors: {
      light: '#EFF6FF', // blue-50 (blasser)
      dark: '#1E40AF', // blue-800 (blasser)
    },
  },
  {
    label: 'Grün',
    value: 'green',
    colors: {
      light: '#F0FDF4', // green-50 (blasser)
      dark: '#166534', // green-800 (blasser)
    },
  },
  {
    label: 'Gelb',
    value: 'yellow',
    colors: {
      light: '#FEFCE8', // yellow-50 (blasser)
      dark: '#854D0E', // yellow-800 (blasser)
    },
  },
  {
    label: 'Orange',
    value: 'orange',
    colors: {
      light: '#FFF7ED', // orange-50 (blasser)
      dark: '#9A3412', // orange-800 (blasser)
    },
  },
  {
    label: 'Rot',
    value: 'red',
    colors: {
      light: '#FEF2F2', // red-50 (blasser)
      dark: '#991B1B', // red-800 (blasser)
    },
  },
  {
    label: 'Violett',
    value: 'violet',
    colors: {
      light: '#F5F3FF', // violet-50 (blasser)
      dark: '#6B21A8', // violet-800 (blasser)
    },
  },
  {
    label: 'Pink',
    value: 'pink',
    colors: {
      light: '#FDF2F8', // pink-50 (blasser)
      dark: '#9F1239', // pink-800 (blasser)
    },
  },
  {
    label: 'Cyan',
    value: 'cyan',
    colors: {
      light: '#ECFEFF', // cyan-50 (blasser)
      dark: '#155E75', // cyan-800 (blasser)
    },
  },
  {
    label: 'Lime',
    value: 'lime',
    colors: {
      light: '#F7FEE7', // lime-50 (blasser)
      dark: '#3F6212', // lime-800 (blasser)
    },
  },
  {
    label: 'Indigo',
    value: 'indigo',
    colors: {
      light: '#EEF2FF', // indigo-50 (blasser)
      dark: '#4338CA', // indigo-800 (blasser)
    },
  },
  {
    label: 'Türkis',
    value: 'teal',
    colors: {
      light: '#F0FDFA', // teal-50 (blasser)
      dark: '#115E59', // teal-800 (blasser)
    },
  },
  {
    label: 'Lila',
    value: 'purple',
    colors: {
      light: '#FAF5FF', // purple-50 (blasser)
      dark: '#6B21A8', // purple-800 (blasser)
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
