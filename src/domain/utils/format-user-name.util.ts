export function formatUserName(firstname: string | null | undefined, lastname: string | null | undefined): string {
  const first = firstname?.trim() || ''
  const lastInitial = lastname?.trim()?.[0] || ''
  return `${first} ${lastInitial}.`
}
