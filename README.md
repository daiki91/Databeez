# Databeez

Application web de gestion de projets et de notes d'avancement, conteneurisee avec Docker.

## Stack

- Frontend: React + Vite (`frontend/`)
- Backend: Node.js + Express (`backend/`)
- Base de donnees: MySQL 8
- Stockage fichiers: MinIO (S3-compatible)
- Orchestration: Docker Compose

## Fonctionnalites principales

- Authentification JWT (inscription/connexion)
- Gestion des projets (creation, listing, suppression)
- Gestion des notes (creation, edition, suppression)
- Historique des actions (audit logs)
- Upload de fichiers sur les notes (PDF + images)
- Previsualisation des images et PDF:
  - Dans la page projet (`/projects/:id`)
  - Dans le modal detail de note
  - Dans la liste des projets (si des notes contiennent des fichiers)
- Theme clair/sombre

## Structure du projet

```text
databeez/
├── backend/
│   ├── src/server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docs/
│   ├── ARCHITECTURE.md
│   └── API.md
├── docker-compose.yml
├── sqlScrip.sql
└── README.md
```

## Prerequis

- Docker Desktop (ou Docker Engine + Compose)
- Optionnel: Node.js 20+ pour lancer hors Docker

## Lancement rapide (Docker)

```bash
docker-compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- PhpMyAdmin: `http://localhost:8080`
- MinIO API: `http://localhost:9000`
- MinIO Console: `http://localhost:9001`

Pour arreter:

```bash
docker-compose down
```

Reset complet (supprime volumes):

```bash
docker-compose down -v
```

## Comptes et acces par defaut

Selon `docker-compose.yml`/`.env` du projet:

- MySQL: utilisateur/mot de passe de ton compose
- MinIO:
  - Access key: `admin`
  - Secret key: `passer123`
  - Bucket: `databeez-notes`

## API (resume)

Base URL: `http://localhost:3000/api`

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Projects:

- `GET /projects`
- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`

Notes:

- `GET /projects/:projectId/notes`
- `POST /projects/:projectId/notes`
- `PUT /notes/:id`
- `DELETE /notes/:id`

Attachments:

- `GET /notes/:noteId/attachments`
- `POST /notes/:noteId/attachments` (multipart/form-data, champ `file`)
- `DELETE /notes/:noteId/attachments/:attachmentId`
- `GET /notes/:noteId/attachments/:attachmentId/download`

Historique:

- `GET /projects/:projectId/history`
- `GET /notes/:noteId/history`
- `GET /history?entityType=&entityId=&limit=&offset=`

## Base de donnees

Tables principales:

- `users`
- `projects`
- `notes` (inclut colonne `attachments` JSON)
- `audit_logs`

Le backend cree les tables au demarrage si elles n'existent pas.

## Points importants

- Le frontend doit appeler l'API via `http://localhost:3000/api` depuis le navigateur.
- Les previsualisations de fichiers utilisent des requetes authentifiees (token JWT).
- Les donnees fichiers sont en MinIO, les metadonnees en MySQL.

## Documentation complementaire

- Architecture: `docs/ARCHITECTURE.md`
- API detaillee: `docs/API.md`
- Setup: `SETUP.md`

## Contribution

1. Creer une branche
2. Committer les changements
3. Ouvrir une Pull Request

