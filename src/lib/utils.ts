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
  data: Array<{ id: number }>,
): number | undefined {
  return typeof searchParams[searchParamName] === 'string'
    ? Number(searchParams[searchParamName])
    : data[0]?.id
}
