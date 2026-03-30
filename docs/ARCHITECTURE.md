# 📐 Architecture Databeez

## Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│              (http://localhost:5173)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼ HTTP/WS
        ┌────────────────────────────────┐
        │     FRONTEND (React 19)        │
        │  Port 5173 / Node 20 Alpine   │
        │                                │
        │ - Vite bundler                │
        │ - React Router navigation      │
        │ - TailwindCSS styling          │
        │ - Framer Motion animations    │
        │ - React Query cache            │
        │ - Context API state            │
        └────────────┬───────────────────┘
                     │
                     │ REST API
                     ▼
        ┌────────────────────────────────┐
        │      BACKEND (Node.js)         │
        │  Port 3000 / Node 20 Alpine   │
        │                                │
        │ - Express.js framework         │
        │ - JWT authentication           │
        │ - CORS middleware              │
        │ - RESTful API endpoints        │
        └────────┬──────────────┬────────┘
                 │              │
        ┌────────▼─┐      ┌──────▼──────┐
        │  MySQL   │      │  Minio S3   │
        │ DataBase │      │   Storage   │
        │          │      │             │
        │ Port     │      │ Port 9000   │
        │ 3306     │      │             │
        │          │      │             │
        │ Tables:  │      │ Bucket:     │
        │ - users  │      │ databeez-   │
        │ - projects      │ notes       │
        │ - notes  │      │             │
        └─────────────────┴─────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN INTERFACES                             │
├─────────────────────────────────────────────────────────────────┤
│ • PhpMyAdmin (http://localhost:8080)  - Gestion MySQL           │
│ • Minio Console (http://localhost:9001) - Gestion S3           │
└─────────────────────────────────────────────────────────────────┘
```

## Services Docker

### 🐳 minio
- **Image:** `minio/minio:latest`
- **Ports:** 9000 (API), 9001 (Console)
- **Volume:** `minio_data:/data`
- **Role:** Stockage S3-compatible pour les fichiers de notes
- **Bucket:** `databeez-notes`

### 🐳 mysql
- **Image:** `mysql:8.0`
- **Port:** 3306
- **Volume:** `mysql_data:/var/lib/mysql`
- **Database:** `databeez`
- **Users:** root (rootpass), dbuser (dbpass)
- **Role:** Persistance des données (users, projects, notes metadata)

### 🐳 phpmyadmin
- **Image:** `phpmyadmin:latest`
- **Port:** 8080
- **Role:** Interface web pour gérer MySQL
- **Auth:** dbuser / dbpass

### 🐳 backend
- **Build:** `./backend/Dockerfile`
- **Port:** 3000
- **Volume:** `./backend:/app`
- **Dépend de:** mysql (healthcheck)
- **Role:** API REST Express.js
- **Env vars:** DATABASE_*, MINIO_*, JWT_SECRET

### 🐳 frontend
- **Build:** `./frontend/Dockerfile`
- **Port:** 5173
- **Volume:** `./frontend:/app`
- **Dépend de:** backend
- **Role:** Application web React + Vite
- **Env vars:** VITE_API_URL

## 🔄 Flux de Données

### 1️⃣ Authentification

```
Frontend (Register/Login)
    ↓
Backend: POST /api/auth/register
    ↓
Backend: Hash password (bcrypt)
    ↓
Backend: INSERT user → MySQL + JWT token
    ↓
Frontend: localStorage.setItem('token', jwt)
```

### 2️⃣ CRUD Projets

```
Frontend: Click "Créer Projet"
    ↓
Frontend: POST /api/projects {title, description}
    ↓
Backend: Verify JWT token
    ↓
Backend: INSERT INTO projects → MySQL
    ↓
Frontend: Cache invalidate → React Query
    ↓
Frontend: Afficher le nouveau projet
```

### 3️⃣ Gestion Notes

```
Frontend: Ajouter note au projet
    ↓
Frontend: POST /api/projects/:id/notes
    ↓
Backend: Verify JWT + Save metadata → MySQL
    ↓
Backend: Save note JSON → Minio S3
    ↓
Frontend: React Query refetch
    ↓
Frontend: Afficher la note avec timestamp
```

## 🔐 Sécurité

- **Authentification:** JWT tokens (8h expiry)
- **Mots de passe:** Hashés avec bcrypt (10 rounds)
- **CORS:** Configuré pour développement
- **Validation:** Input validation côté serveur
- **SQL Injection:** Protection par prepared statements (mysql2)
- **Tokens:** Stockés en localStorage (accessible depuis JS)

## 🚀 Déploiement

### Local (Développement)
```bash
docker-compose up --build
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# MySQL: http://localhost:8080 (PhpMyAdmin)
# Minio: http://localhost:9001 (Console)
```

### Production (Recommandations)
- Utiliser `NODE_ENV=production`
- Mettre à jour `VITE_API_URL` vers domaine réel
- Utiliser HTTPS/SSL
- Secrets dans `.env` (jamais en git)
- Limiter les CORS à domaine spécifique
- Backups réguliers MySQL + Minio
- Monitoring avec ELK stack ou DataDog

## 📊 Schéma de Base de Données

```sql
-- Users
users (id, email, phone, password_hash, created_at)
  - email UNIQUE
  - phone UNIQUE
  - password_hash (bcrypt)

-- Projects
projects (id, user_id, title, description, created_at, updated_at)
  - Lié à users.id (CASCADE)

-- Notes
notes (id, project_id, title, description, created_at, updated_at)
  - Lié à projects.id (CASCADE)
  - JSON stocké dans Minio
```

## 🔗 Communications Inter-Services

### Frontend → Backend
```
http://localhost:3000/api/...
Header: Authorization: Bearer {jwt_token}
```

### Backend → MySQL
```
Host: mysql (DNS réseau Docker)
Port: 3306
Pool: 10 connections
```

### Backend → Minio
```
Host: minio (DNS réseau Docker)
Port: 9000
AccessKey: admin
SecretKey: passer123
```

## 📈 Scalabilité

### Horizontal (Ajouter plus d'instances)
- Frontend: Derrière load balancer (nginx)
- Backend: Derrière API Gateway + load balancer
- MySQL: Master-Slave replication
- Minio: Cluster mode

### Vertical (Ressources)
- Augmenter CPU/RAM en production
- Optimiser indices MySQL
- Cache Redis pour React Query
- CDN pour assets statiques

## 🐛 Debugging

### Logs Backend
```bash
docker-compose logs backend -f
```

### Logs Frontend
```bash
docker-compose logs frontend -f
```

### Logs MySQL
```bash
docker-compose logs mysql -f
```

### Shell dans Backend
```bash
docker exec -it databeez-backend sh
cd app && npm run dev
```

### Shell dans Frontend
```bash
docker exec -it databeez-frontend sh
```

## ✅ Checklist Déploiement

- [ ] Tester toutes routes API avec Postman/Thunder Client
- [ ] Vérifier authentification JWT bien configurée
- [ ] Tester CRUD complet (create, read, update, delete)
- [ ] Vérifier Minio s3 uploads/downloads
- [ ] Tests sur mobile (responsive design)
- [ ] Vérifier thème clair/sombre
- [ ] Améliorer seed data (test projects)
- [ ] Documenter API avec Swagger
- [ ] Setup CI/CD (GitHub Actions)
- [ ] Monitoring et alertes

---

**Développé par daiki91** | Architecture modernes avec Docker, React 19, Node.js