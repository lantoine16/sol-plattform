# Payload

## Architektur

Die Anwendung folgt einer klaren Schichtenarchitektur mit Trennung von Domain-Logik und Application-Implementierung.

### Verzeichnisstruktur

```
src/
├── domain/                    # Domain Layer (Business-Logik, unabhängig von Technologie)
│   ├── constants/            # Domain-spezifische Konstanten
│   │   └── task-status.constants.ts
│   └── models/              # Domain Models (aktuell leer)
│
├── lib/                      # Application Layer (Technologie-spezifische Implementierung)
│   ├── data/                 # Datenzugriff
│   │   ├── payload-client.ts # Payload CMS Client
│   │   └── repositories/    # Repository Pattern für Datenzugriff
│   │       ├── user.repository.ts
│   │       ├── task.repository.ts
│   │       ├── task-progress.repository.ts
│   │       ├── class.repository.ts
│   │       └── subject.repository.ts
│   ├── services/             # Business Logic Services
│   │   └── dashboard.service.ts
│   ├── types.ts              # View/DTO Types für Präsentation
│   └── utils.ts              # Utility-Funktionen
│
├── app/                      # Next.js App Router
│   ├── (frontend)/           # Frontend-Routen
│   └── (payload)/           # Payload CMS Admin
│
├── components/               # React Komponenten
│   ├── features/             # Feature-basierte Komponenten
│   │   └── dashboard/
│   └── ui/                   # UI-Komponenten (shadcn/ui)
│
└── collections/              # Payload CMS Collections
    ├── Users.ts
    ├── tasks.ts
    ├── task-progress.ts
    ├── classes.ts
    └── subjects.ts
```

### Architektur-Patterns

#### Domain Layer (`domain/`)

- **Zweck**: Enthält die Business-Domain-Logik, unabhängig von Framework oder Technologie
- **Inhalt**: Domain Constants, Domain Models, Business Rules
- **Beispiel**: `task-status.constants.ts` definiert die Status-Werte und deren Labels

#### Application Layer (`lib/`)

- **Zweck**: Technologie-spezifische Implementierung der Anwendung
- **Komponenten**:
  - **Repositories** (`lib/data/repositories/`): Abstrahieren den Datenzugriff über Payload CMS
  - **Services** (`lib/services/`): Enthalten Business Logic, koordinieren Repository-Aufrufe und transformieren Daten
  - **Types** (`lib/types.ts`): View/DTO Types für die Präsentationsschicht
  - **Utils** (`lib/utils.ts`): Wiederverwendbare Utility-Funktionen

#### Datenfluss

```
Page Component
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Datenzugriff)
    ↓
Payload CMS Client
    ↓
Payload CMS / Database
```

### Design Patterns

- **Repository Pattern**: Abstrahiert Datenzugriff in `lib/data/repositories/`
- **Service Layer Pattern**: Business Logic in `lib/services/` statt direkt in Komponenten
- **Feature-based Structure**: Komponenten nach Features gruppiert in `components/features/`

### Type-Safety

- **Payload Types**: Automatisch generiert via `pnpm run generate:types` → `payload-types.ts`
- **Domain Constants**: Type-safe Status-Werte in `domain/constants/task-status.constants.ts`
- **View Types**: Application-spezifische View/DTO Types in `lib/types.ts`

## 🚀 Getting Started

**Neu im Projekt?** Folge der detaillierten [Setup-Anleitung (SETUP.md)](SETUP.md) für eine Schritt-für-Schritt Installation auf Windows oder Linux.

Die Anleitung umfasst:

- Installation von Node.js, pnpm und Docker
- Konfiguration der Umgebungsvariablen
- Start des Projekts mit Docker Compose

**Schnellstart (für erfahrene Entwickler):**

```bash
# Repository klonen
git clone <REPOSITORY_URL>
cd sol

# MongoDB starten (nur MongoDB, nicht das ganze Projekt)
docker compose up mongo -d

# .env Datei erstellen
echo "PAYLOAD_SECRET=dein-super-geheimer-schluessel-hier-min-32-zeichen" > .env
echo "DATABASE_URI=mongodb://lukas:lukaspassword@localhost:27017/sol?authSource=admin" >> .env

# Dependencies installieren
pnpm install

# Projekt starten
pnpm run dev
```

Dann öffne http://localhost:3000 im Browser.

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.mainzcript.eu/training/payload.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.mainzcript.eu/training/payload/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

---

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name

Choose a self-explaining name for your project.

## Description

Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges

On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals

Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation

Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage

Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support

Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap

If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing

State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment

Show your appreciation to those who have contributed to the project.

## License

For open source projects, say how it is licensed.

## Project status

If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
