# Projekt Setup-Anleitung

Diese Anleitung führt dich Schritt für Schritt durch die Installation und den Start des Projekts.

## Voraussetzungen

- **Node.js** Version 18.20.2 oder >=20.9.0 (enthält npm, aber wir nutzen es nicht für pnpm)
- **pnpm** Version 9 oder 10
- **Docker Desktop** (für Windows/Mac) oder **Docker** (für Linux) - **nur für MongoDB**
- **Git** (zum Klonen des Repositories)

---

## 📋 Schritt-für-Schritt Anleitung

### Teil 1: Node.js installieren

#### Windows:

1. Gehe zu https://nodejs.org/
2. Lade die **LTS-Version** (empfohlen: Version 20.x oder höher) herunter
3. Führe den Installer aus und folge den Anweisungen
4. Während der Installation: Stelle sicher, dass "Add to PATH" aktiviert ist
5. Öffne ein **neues** Terminal/PowerShell-Fenster
6. Prüfe die Installation:
   ```powershell
   node --version
   ```
   Sollte z.B. `v20.11.0` oder ähnlich anzeigen

#### Linux:

1. Öffne ein Terminal
2. Installiere Node.js mit einem Package Manager:

   **Ubuntu/Debian:**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

   **Fedora/RHEL:**

   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
   sudo dnf install -y nodejs
   ```

   **Arch Linux:**

   ```bash
   sudo pacman -S nodejs npm
   ```

3. Prüfe die Installation:
   ```bash
   node --version
   ```
   Sollte z.B. `v20.11.0` oder ähnlich anzeigen

---

### Teil 2: pnpm installieren

**Wichtig:** Du brauchst **KEIN npm** für die pnpm-Installation! Node.js reicht aus.

#### Windows:

**Option 1: Mit Corepack (empfohlen - kommt mit Node.js):**

1. Öffne PowerShell oder Command Prompt
2. Aktiviere Corepack:
   ```powershell
   corepack enable
   ```
3. Aktiviere pnpm:
   ```powershell
   corepack prepare pnpm@latest --activate
   ```
4. Prüfe die Installation:
   ```powershell
   pnpm --version
   ```
   Sollte z.B. `9.0.0` oder höher anzeigen

**Option 2: Mit PowerShell Script (ohne npm):**

1. Öffne PowerShell
2. Führe aus:
   ```powershell
   iwr https://get.pnpm.io/install.ps1 -useb | iex
   ```
3. Starte PowerShell neu
4. Prüfe die Installation:
   ```powershell
   pnpm --version
   ```

#### Linux:

**Option 1: Mit Corepack (empfohlen - kommt mit Node.js):**

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

Prüfe die Installation:

```bash
pnpm --version
```

**Option 2: Mit Install-Script (ohne npm):**

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Danach Terminal neu starten oder:

```bash
source ~/.bashrc
```

Prüfe die Installation:

```bash
pnpm --version
```

**Option 3: Mit Homebrew (nur macOS/Linux mit Homebrew):**

```bash
brew install pnpm
```

---

### Teil 3: Docker installieren (nur für MongoDB)

**Hinweis:** Docker wird hier **nur für MongoDB** benötigt. Das eigentliche Projekt läuft lokal auf deinem Computer.

#### Windows:

1. Gehe zu https://www.docker.com/products/docker-desktop/
2. Lade **Docker Desktop für Windows** herunter
3. Führe den Installer aus
4. **Wichtig:** Starte deinen Computer nach der Installation neu
5. Starte Docker Desktop (sollte im Startmenü erscheinen)
6. Warte, bis Docker Desktop vollständig gestartet ist (Icon in der Taskleiste)
7. Öffne ein Terminal/PowerShell
8. Prüfe die Installation:
   ```powershell
   docker --version
   docker-compose --version
   ```

#### Linux:

**Ubuntu/Debian:**

```bash
# Alte Versionen entfernen (falls vorhanden)
sudo apt-get remove docker docker-engine docker.io containerd runc

# Repository hinzufügen
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# Docker's offiziellen GPG-Schlüssel hinzufügen
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Repository hinzufügen
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker installieren
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Docker ohne sudo ausführen (optional, aber empfohlen)
sudo usermod -aG docker $USER
```

**Wichtig:** Nach dem Hinzufügen deines Benutzers zur docker-Gruppe, melde dich ab und wieder an!

**Fedora/RHEL:**

```bash
sudo dnf install docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

**Arch Linux:**

```bash
sudo pacman -S docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

Prüfe die Installation:

```bash
docker --version
docker compose version
```

---

### Teil 4: Repository klonen

1. Öffne ein Terminal/PowerShell
2. Navigiere zu dem Ordner, wo du das Projekt speichern möchtest:

   ```bash
   # Windows
   cd C:\Users\DeinName\Documents

   # Linux
   cd ~/Documents
   ```

3. Klone das Repository:

   ```bash
   git clone <REPOSITORY_URL>
   ```

   (Ersetze `<REPOSITORY_URL>` mit der tatsächlichen URL des Repositories)

4. Wechsle in das Projektverzeichnis:
   ```bash
   cd sol
   ```
   (oder wie auch immer das Projektverzeichnis heißt)

---

### Teil 5: MongoDB mit Docker starten

**Wichtig:** Wir starten nur MongoDB mit Docker. Das eigentliche Projekt läuft lokal auf deinem Computer.

1. Stelle sicher, dass **Docker Desktop** (Windows) läuft oder Docker-Dienst (Linux) aktiv ist

2. Öffne ein Terminal/PowerShell im Projektverzeichnis

3. Starte nur den MongoDB Container:

   ```bash
   docker compose up mongo -d
   ```

   **Hinweis:**
   - `-d` startet den Container im Hintergrund
   - Beim ersten Start kann dies einige Minuten dauern, da Docker das MongoDB-Image herunterlädt

4. Prüfe, ob MongoDB läuft:

   ```bash
   docker compose ps
   ```

   Du solltest sehen:

   ```
   NAME        IMAGE           STATUS
   mongo_sol   mongo:latest    Up
   ```

5. **Wichtig:** Lasse Docker laufen! MongoDB muss laufen, damit das Projekt funktioniert.

---

### Teil 6: Umgebungsvariablen konfigurieren (.env Datei)

**Wichtig:** Die `.env` Datei ist nicht im Repository enthalten (aus Sicherheitsgründen). Du musst sie selbst erstellen.

1. Erstelle eine Datei namens `.env` im Hauptverzeichnis des Projekts

   **Option 1: Kopiere die Vorlage (empfohlen):**

   **Windows:**

   ```powershell
   # Im Projektverzeichnis
   Copy-Item .env.example .env
   ```

   **Linux/Mac:**

   ```bash
   cp .env.example .env
   ```

   **Option 2: Erstelle die Datei manuell:**

   **Windows:**

   ```powershell
   # Im Projektverzeichnis
   New-Item -Path .env -ItemType File
   ```

   Oder erstelle die Datei manuell im Windows Explorer

   **Linux:**

   ```bash
   touch .env
   ```

2. Öffne die `.env` Datei mit einem Texteditor (z.B. Notepad, VS Code, nano)

3. **Wenn du die Vorlage kopiert hast:** Passe die Werte an (besonders `PAYLOAD_SECRET`!)

   **Wenn du die Datei manuell erstellt hast:** Füge folgende Zeilen ein:

   ```env
   PAYLOAD_SECRET=dein-super-geheimer-schluessel-hier-min-32-zeichen
   DATABASE_URI=mongodb://lukas:lukaspassword@localhost:27017/sol?authSource=admin
   ```

   **Wichtig:**
   - `PAYLOAD_SECRET`: Ersetze mit einem zufälligen, sicheren Passwort (mindestens 32 Zeichen lang)
     - Beispiel: `mein-super-geheimer-schluessel-12345678901234567890`
   - `DATABASE_URI`:
     - `localhost` statt `mongo` (weil MongoDB lokal auf deinem Computer läuft, nicht im Container)
     - Port `27017` ist der Port, den Docker für MongoDB freigibt
     - Die Credentials (`lukas`/`lukaspassword`) sind in `docker-compose.yml` fest definiert

4. Speichere die Datei

---

### Teil 7: Dependencies installieren

1. Öffne ein Terminal/PowerShell im Projektverzeichnis

2. Installiere alle benötigten Pakete:

   ```bash
   pnpm install
   ```

   **Hinweis:** Dies kann einige Minuten dauern beim ersten Mal.

3. Warte, bis die Installation abgeschlossen ist. Du solltest am Ende sehen:
   ```
   Packages: +XXX
   +XXX packages installed
   ```

---

### Teil 8: Projekt starten

1. Stelle sicher, dass MongoDB läuft (siehe Teil 5)

2. Im Projektverzeichnis, starte den Development-Server:

   ```bash
   pnpm run dev
   ```

3. Warte, bis du eine Meldung siehst wie:

   ```
   ▲ Next.js 15.4.4
   - Local:        http://localhost:3000
   ```

   **Wichtig:** Lasse dieses Terminal-Fenster geöffnet! Wenn du es schließt, stoppt der Server.

---

### Teil 9: Projekt im Browser öffnen

1. Öffne deinen Webbrowser (Chrome, Firefox, Edge, etc.)

2. Gehe zu:

   ```
   http://localhost:3000
   ```

3. Du solltest jetzt die Payload CMS Admin-Oberfläche sehen!

---

## 🛠️ Häufige Probleme und Lösungen

### Problem: "docker: command not found" oder "docker: Der Befehl wurde nicht gefunden"

**Lösung:**

- **Windows:** Stelle sicher, dass Docker Desktop installiert und gestartet ist
- **Linux:** Prüfe, ob Docker installiert ist: `sudo systemctl status docker`
- Starte dein Terminal neu

### Problem: "pnpm: command not found" oder "pnpm: Der Befehl wurde nicht gefunden"

**Lösung:**

- **Mit Corepack (empfohlen):**
  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  ```
- **Mit Install-Script:**
  - Windows: `iwr https://get.pnpm.io/install.ps1 -useb | iex`
  - Linux: `curl -fsSL https://get.pnpm.io/install.sh | sh -`
- Starte dein Terminal neu
- Prüfe, ob pnpm im PATH ist: `where pnpm` (Windows) oder `which pnpm` (Linux)

### Problem: Port 3000 ist bereits belegt

**Lösung:**

- Prüfe, was auf Port 3000 läuft:

  ```bash
  # Windows
  netstat -ano | findstr :3000

  # Linux
  sudo lsof -i :3000
  ```

- Stoppe den Prozess oder ändere den Port in `docker-compose.yml`

### Problem: MongoDB-Verbindungsfehler

**Lösung:**

- Stelle sicher, dass der MongoDB-Container läuft: `docker compose ps`
- Prüfe die Logs: `docker compose logs mongo`
- Stelle sicher, dass die `.env` Datei korrekt ist
- **Wichtig:** In der `DATABASE_URI` muss `localhost` stehen, nicht `mongo`!
  - Richtig: `mongodb://lukas:lukaspassword@localhost:27017/sol?authSource=admin`
  - Falsch: `mongodb://lukas:lukaspassword@mongo:27017/sol?authSource=admin`

### Problem: "Cannot find module" Fehler

**Lösung:**

- Installiere die Dependencies neu: `pnpm install`
- Stelle sicher, dass du im richtigen Verzeichnis bist
- Lösche `node_modules` und installiere neu:
  ```bash
  rm -rf node_modules
  pnpm install
  ```
  (Windows: `rmdir /s /q node_modules`)

### Problem: Docker Container startet nicht

**Lösung:**

- Prüfe die Logs: `docker compose logs mongo`
- Stelle sicher, dass Docker läuft
- Versuche, den Container neu zu starten: `docker compose restart mongo`
- Prüfe, ob Port 27017 bereits belegt ist:

  ```bash
  # Windows
  netstat -ano | findstr :27017

  # Linux
  sudo lsof -i :27017
  ```

---

## 📝 Nützliche Befehle

### MongoDB Container verwalten

```bash
# MongoDB Container starten (im Hintergrund)
docker compose up mongo -d

# MongoDB Container stoppen
docker compose stop mongo

# MongoDB Container neu starten
docker compose restart mongo

# Status der Container anzeigen
docker compose ps

# MongoDB Container stoppen und entfernen
docker compose down
```

### MongoDB Logs anzeigen

```bash
# MongoDB Logs anzeigen
docker compose logs mongo

# MongoDB Logs live verfolgen
docker compose logs -f mongo
```

### Projekt-Befehle

```bash
# Dependencies installieren
pnpm install

# Development Server starten
pnpm run dev

# Projekt bauen (für Produktion)
pnpm run build

# Projekt starten (nach Build)
pnpm start

# TypeScript Types generieren
pnpm run generate:types
```

### MongoDB Shell öffnen (optional)

```bash
# MongoDB Shell öffnen
docker compose exec mongo mongosh
```

---

## 🎉 Fertig!

Wenn alles funktioniert, solltest du jetzt:

- ✅ MongoDB läuft in Docker
- ✅ Das Projekt läuft lokal mit `pnpm run dev`
- ✅ Auf http://localhost:3000 zugreifen können
- ✅ Die Payload CMS Admin-Oberfläche sehen

**Viel Erfolg! 🚀**

---

## 📋 Zusammenfassung der wichtigsten Befehle

```bash
# 1. MongoDB starten (einmalig, läuft im Hintergrund)
docker compose up mongo -d

# 2. Dependencies installieren (einmalig)
pnpm install

# 3. Projekt starten (jedes Mal, wenn du entwickelst)
pnpm run dev
```

**Wichtig:**

- MongoDB muss laufen, bevor du `pnpm run dev` startest
- Lasse beide Terminal-Fenster offen (MongoDB läuft dauerhaft, `pnpm run dev` läuft während der Entwicklung)

---

## 📞 Hilfe benötigt?

Falls du Probleme hast:

1. Prüfe die Logs: `docker compose logs`
2. Stelle sicher, dass alle Voraussetzungen installiert sind
3. Kontaktiere das Team für Unterstützung
