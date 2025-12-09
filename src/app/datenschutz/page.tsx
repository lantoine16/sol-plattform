import type { Metadata } from 'next'
import Link from 'next/link'

// Force dynamic rendering to read environment variables at runtime
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - Lernjobmonitoring',
  description: 'Datenschutzerklärung für die Anwendung Lernjobmonitoring',
}

export default function DatenschutzPage() {
  // Kontaktdaten aus Umgebungsvariablen (zur Laufzeit geladen)
  const schoolName = process.env.SCHOOL_NAME
  const schoolStreet = process.env.SCHOOL_STREET
  const schoolPostalCode = process.env.SCHOOL_POSTAL_CODE
  const schoolCity = process.env.SCHOOL_CITY
  const schoolPhone = process.env.SCHOOL_PHONE
  const schoolEmail = process.env.SCHOOL_EMAIL

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>

        <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Verantwortlicher</h2>
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p>
                {schoolName}
                <br />
                {schoolStreet}
                <br />
                {schoolPostalCode} {schoolCity}
                <br />
                Tel.: {schoolPhone}
                <br />
                E-Mail: {schoolEmail}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              2. Verarbeitete personenbezogene Daten
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Benutzerdaten</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Vorname und Nachname</strong>: Zur Identifikation und Anzeige in der
                Anwendung
              </li>
              <li>
                <strong>E-Mail-Adresse</strong> (optional): Für Login und Kommunikation
              </li>
              <li>
                <strong>Benutzername</strong>: Für die Anmeldung am System
              </li>
              <li>
                <strong>Passwort</strong>: Verschlüsselt gespeichert (Hash), nicht im Klartext
              </li>
              <li>
                <strong>Rolle</strong>: Schüler, Lehrer oder Administrator
              </li>
              <li>
                <strong>Lerngruppen-Zuordnung</strong>: Zuordnung zu Lerngruppen
              </li>
              <li>
                <strong>Lernorte</strong>: Aktueller und Standard-Lernort
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              3.2 Lernfortschrittsdaten
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Aufgabenfortschritte</strong>: Status der Bearbeitung von Aufgaben (nicht
                begonnen, in Bearbeitung, fertig)
              </li>
              <li>
                <strong>Hilfebedarf</strong>: Information, ob Schüler Hilfe benötigt
              </li>
              <li>
                <strong>Partnersuche</strong>: Information, ob Schüler einen Lernpartner sucht
              </li>
              <li>
                <strong>Zuordnung zu Aufgaben</strong>: Welche Aufgaben welchen Schülern zugeordnet
                sind
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.3 Technische Daten</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Login-Sessions</strong>: Informationen über aktive Anmeldungen
              </li>
              <li>
                <strong>Login-Versuche</strong>: Zur Sicherheit (Sperrung bei zu vielen
                Fehlversuchen)
              </li>
              <li>
                <strong>Zeitstempel</strong>: Erstellungs- und Änderungsdaten
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              3. Rechtsgrundlage der Verarbeitung
            </h2>
            <p>Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage von:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Art. 6 Abs. 1 lit. e DSGVO</strong> (Aufgabe im öffentlichen Interesse): Die
                Verarbeitung dient der Erfüllung des Bildungsauftrags der Schule
              </li>
              <li>
                <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (Berechtigtes Interesse): Unterstützung
                des selbstorganisierten Lernens und der pädagogischen Betreuung
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              4. Zweck der Datenverarbeitung
            </h2>
            <p>
              Diese Anwendung dient der Verwaltung und Dokumentation des selbstorganisierten Lernens
              (SOL) an unserer Schule. Sie ermöglicht es Lehrkräften, Aufgaben zu erstellen und den
              Lernfortschritt der Schülerinnen und Schüler zu verfolgen.
            </p>
            <p className="mt-4">Die Daten werden ausschließlich für folgende Zwecke verwendet:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Verwaltung von Lernaufgaben</li>
              <li>Dokumentation des Lernfortschritts</li>
              <li>Pädagogische Betreuung und Unterstützung der Schüler</li>
              <li>Kommunikation zwischen Lehrkräften und Schülern</li>
              <li>Verwaltung von Lerngruppen und Lernorten</li>
              <li>Sicherstellung der Systemfunktionalität und -sicherheit</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              5. Datenzugriff und Berechtigungen
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">5.1 Schüler</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Zugriff nur auf eigene Daten</li>
              <li>Einsehen der eigenen Aufgaben und Fortschritte</li>
              <li>Änderung des eigenen Passworts</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">5.2 Lehrkräfte</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Zugriff auf Daten von Schülern</li>
              <li>Erstellung und Verwaltung von Aufgaben</li>
              <li>Einsehen der Lernfortschritte von Schülern</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">5.3 Administratoren</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vollzugriff auf alle Daten (für Systemverwaltung)</li>
              <li>Verwaltung aller Benutzer</li>
              <li>Systemkonfiguration</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Datenweitergabe</h2>
            <p>
              Personenbezogene Daten werden <strong>nicht an Dritte weitergegeben</strong>. Die
              Daten werden ausschließlich innerhalb der Schule für die oben genannten Zwecke
              verwendet.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Datenspeicherung</h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">7.1 Speicherort</h3>
            <p>Die Daten werden auf Servern in Deutschland gespeichert.</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">7.2 Speicherdauer</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Aktive Schüler</strong>: Daten werden während der Schulzeit gespeichert
              </li>
              <li>
                <strong>Nach Schulabgang</strong>: Daten werden spätestens 2 Jahre nach Schulabgang
                gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen
              </li>
              <li>
                <strong>Lehrkräfte</strong>: Daten werden während der Beschäftigung und ggf. darüber
                hinaus entsprechend gesetzlicher Aufbewahrungspflichten gespeichert
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              8. Technische Sicherheitsmaßnahmen
            </h2>
            <p>Zur Sicherung der Daten werden folgende Maßnahmen getroffen:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Verschlüsselung</strong>: Passwörter werden verschlüsselt (gehasht)
                gespeichert
              </li>
              <li>
                <strong>Zugriffskontrolle</strong>: Rollenbasierte Zugriffsrechte
              </li>
              <li>
                <strong>Authentifizierung</strong>: Sichere Anmeldung mit Benutzername/Passwort
              </li>
              <li>
                <strong>HTTPS</strong>: Verschlüsselte Datenübertragung
              </li>
              <li>
                <strong>Regelmäßige Updates</strong>: System wird regelmäßig aktualisiert
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Ihre Rechte</h2>
            <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>

            <div className="space-y-4 mt-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  9.1 Auskunftsrecht (Art. 15 DSGVO)
                </h3>
                <p>Sie können Auskunft über die zu Ihrer Person gespeicherten Daten verlangen.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  9.2 Berichtigungsrecht (Art. 16 DSGVO)
                </h3>
                <p>Sie können die Berichtigung unrichtiger Daten verlangen.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  9.3 Löschungsrecht (Art. 17 DSGVO)
                </h3>
                <p>
                  Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen
                  Aufbewahrungspflichten entgegenstehen.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">9.4 Beschwerderecht</h3>
                <p>
                  Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren, wenn Sie der
                  Ansicht sind, dass die Verarbeitung Ihrer Daten gegen die DSGVO verstößt.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Cookies und Tracking</h2>
            <p>
              Diese Anwendung verwendet <strong>keine Cookies</strong> für Tracking-Zwecke. Es
              werden lediglich technisch notwendige Session-Cookies für die Anmeldung verwendet, die
              nach dem Logout automatisch gelöscht werden.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              11. Änderungen dieser Datenschutzerklärung
            </h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte
              Rechtslagen oder technische Entwicklungen anzupassen. Die jeweils aktuelle Version ist
              über die Anwendung abrufbar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Kontakt</h2>
            <p>Bei Fragen zum Datenschutz wenden Sie sich bitte an den oben genannten Kontakt.</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link
            href="/"
            className="text-gray-600 no-underline hover:text-gray-800 hover:underline transition-colors"
          >
            Zurück zur Login-Seite
          </Link>
        </div>
      </div>
    </div>
  )
}
