import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolve an ID from search params or return the first item's ID from data array
 * @param searchParams - The search params object
 * @param searchParamName - The name of the search param to look for
 * @param data - Array of objects with an `id` property
 * @returns The resolved ID or undefined
 */
export function resolveIdFromSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
  searchParamName: string,
  data: Array<{ id: string }>,
): string | undefined {
  const paramValue = searchParams[searchParamName]

  // Wenn paramValue ein String ist, verwende ihn direkt
  if (typeof paramValue === 'string' && paramValue !== '') {
    return paramValue
  }

  // Wenn paramValue ein Array ist, nimm das erste Element
  if (Array.isArray(paramValue) && paramValue.length > 0) {
    return paramValue[0]
  }

  // Fallback: erstes Element aus data
  return data[0]?.id
}
