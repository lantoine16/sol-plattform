/**
 * Validiert eine E-Mail-Adresse mit einem RFC 5322-konformen Regex
 * @param email - Die zu validierende E-Mail-Adresse
 * @returns true wenn die E-Mail-Adresse gültig ist, sonst false
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.trim() === '') {
    return false
  }

  const trimmedEmail = email.trim()

  // RFC 5322-konformer Regex für E-Mail-Validierung
  // Vereinfachte Version, die die meisten gültigen E-Mails erkennt
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

  // Prüfe zuerst den Regex
  if (!emailRegex.test(trimmedEmail)) {
    return false
  }

  // Zusätzliche Prüfung: Domain-Teil muss mindestens einen Punkt enthalten
  // (z.B. "t@t" ist ungültig, aber "t@t.de" ist gültig)
  const atIndex = trimmedEmail.indexOf('@')
  if (atIndex === -1) {
    return false
  }

  const domainPart = trimmedEmail.substring(atIndex + 1)
  // Domain muss mindestens einen Punkt enthalten (für Top-Level-Domain)
  if (!domainPart.includes('.')) {
    return false
  }

  // Stelle sicher, dass nach dem letzten Punkt noch mindestens ein Zeichen kommt
  const lastDotIndex = domainPart.lastIndexOf('.')
  if (lastDotIndex === -1 || lastDotIndex === domainPart.length - 1) {
    return false
  }

  return true
}
