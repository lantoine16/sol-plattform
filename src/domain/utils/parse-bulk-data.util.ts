/**
 * Parst einen mehrzeiligen Text in ein Array von Strings.
 * Teilt den Text an Zeilenumbrüchen auf, entfernt Leerzeichen am Anfang/Ende
 * und filtert leere Zeilen heraus.
 *
 * @param bulkData - Der mehrzeilige Text, der geparst werden soll
 * @returns Array von Strings (eine pro Zeile, ohne leere Zeilen)
 */
export function parseBulkData(bulkData: string): string[] {
  return bulkData
    .split('\n')
    .map((name) => name.trim())
    .filter((name) => name.length > 0)
}

