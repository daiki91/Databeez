# 🚀 Setup & Launch Guide

## Structure Finale

```
databeez/
├── backend/                 ✅ Code API Node.js + Express
│   ├── src/
│   │   └── server.js
│   ├── package.json        
│   ├── package-lock.json   ✅ Généré
│   ├── node_modules/       ✅ Installé
│   ├── Dockerfile          ✅ Créé
│   ├── .env                ✅ Créé
│   └── README.md           ✅ Créé
│
├── frontend/               ✅ Renommé (gestion/ → frontend/)
│   ├── src/
│   ├── public/
│   ├── package.json        ✅ Existe
│   ├── package-lock.json   ✅ Existe
│   ├── node_modules/       ✅ Existe
│   ├── Dockerfile          ✅ Créé (copie de Dockerfile.frontend)
│   ├── .env                ✅ Créé
│   ├── .npmrc              ✅ Existe
│   └── README.md           ✅ Créé/Mis à jour
│
├── docs/                   ✅ Nouveau
│   ├── ARCHITECTURE.md     ✅ Documentation architecture
│   └── API.md             ✅ Documentation API
│
├── docker-compose.yml      ✅ Mise à jour
│   ├── backend → ./backend
│   └── frontend → ./frontend
│
└── README.md              ✅ Mise à jour avec nouvelle structure

Files à nettoyer:
❌ Dockerfile.backend (legacy)
❌ package.json (root, legacy)
❌ server.js (root, déplacé dans backend/src/)
```

## ✅ Vérification Pré-Launch

Avant de lancer, vérifiez:

```bash
# 1. Backend structure
ls -la backend/
# Doit voir: src/, package.json, Dockerfile, .env, node_modules

# 2. Frontend structure  
ls -la frontend/
# Doit voir: src/, public/, package.json, Dockerfile, .env, node_modules

# 3. Docker-compose
cat docker-compose.yml | grep -A5 "backend:"
# Doit voir: context: ./backend, dockerfile: Dockerfile

cat docker-compose.yml | grep -A5 "frontend:"
# Doit voir: context: ./frontend, dockerfile: Dockerfile
```

## 🚀 Lancer l'Application

### Option 1: Build et lancement complet
```bash
cd c:\Users\arphan\OneDrive\Bureau\databeez

# Construire et lancer tous les conteneurs
docker-compose up --build

# Attendez ~30-60 secondes
# Vous devez voir:
# ✅ databeez-mysql is ready
# ✅ minio started
# ✅ Backend server listening on port 3000
# ✅ VITE v4.x.x ready in XXXms
```

### Option 2: Arrière-plan (daemon mode)
```bash
# Lancer sans afficher les logs
docker-compose up -d --build

# Vérifier le statut
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f
```

## ✅ Vérifier les Services

Ouvrez votre navigateur et testez :

| Service | URL | Expected |
|---------|-----|----------|
| Frontend | http://localhost:5173 | Page login/register |
| Backend API | http://localhost:3000/api | (Page blanche) |
| PhpMyAdmin | http://localhost:8080 | Interface MySQL |
| Minio Console | http://localhost:9001 | Interface S3 |

## 🧪 Test Complet

### 1. Créer un compte
```
1. Allez sur http://localhost:5173
2. Cliquez "S'inscrire"
3. Email: test@example.com
4. Mot de passe: password123
5. Cliquez "S'inscrire"
```

### 2. Créer un projet
```
1. You're redirected to /dashboard
2. Cliquez "Projets" dans le sidebar
3. Cliquez "Nouveau projet"
4. Titre: "Mon Premier Projet"
5. Description: "Test de la restructuration"
6. Cliquez "Créer"
```

### 3. Ajouter une note
```
1. Cliquez sur le projet créé
2. Remplissez la note:
   - Titre: "Test Note"
   - Description: "Vérification que tout fonctionne"
3. Cliquez "Ajouter"
4. La note doit apparaître
```

### 4. Vérifier la BD
```
1. Allez sur http://localhost:8080
2. User: dbuser / Pass: dbpass
3. Sélectionnez databeez database
4. Vérifiez les tables:
   - users → votre compte
   - projects → le projet créé
   - notes → la note créée
```

### 5. Vérifier Minio S3
```
1. Allez sur http://localhost:9001
2. Entre admin / passer123
3. Bucket: databeez-notes
4. Fichier JSON créé pour la note
```

## 🛑 Arrêter les Services

```bash
# Arrêter les conteneurs
docker-compose down

# Arrêter ET supprimer les volumes (données)
docker-compose down -v
```

## 🐛 Debugging

### Voir les logs d'un service spécifique
```bash
docker-compose logs backend -f       # Backend uniquement
docker-compose logs frontend -f      # Frontend uniquement
docker-compose logs mysql -f         # MySQL uniquement
```

### Entrer dans un conteneur
```bash
# Backend shell
docker exec -it databeez-backend sh
cd /app && npm run dev

# Frontend shell
docker exec -it databeez-frontend sh
npm run dev

# MySQL shell
docker exec -it databeez-mysql mysql -u dbuser -p databeez
```

### Reconstruire une image
```bash
# Backend uniquement
docker-compose build backend
docker-compose up backend

# Frontend uniquement
docker-compose build frontend
docker-compose up frontend
```

## 📊 Structure Résumée

### Backend
- 📁 `backend/` - Code API
- 🔧 `backend/src/server.js` - Serveur principal
- 📦 `backend/package.json` - Dépendances (bcrypt, express, mysql2, etc.)
- 🐳 `backend/Dockerfile` - Image Docker
- ⚙️ `backend/.env` - Variables d'environnement

### Frontend
- 📁 `frontend/` - Code React
- ⚛️ `frontend/src/` - Composants, pages, services
- 📦 `frontend/package.json` - Dépendances (react, vite, tailwind, etc.)
- 🐳 `frontend/Dockerfile` - Image Docker
- ⚙️ `frontend/.env` - Variables d'environnement

### Infrastructure
- 🐘 `docker-compose.yml` - Orchestration (MySQL, Minio, Backend, Frontend)
- 📄 `sqlScrip.sql` - Schéma de base de données

### Documentation
- 📚 `docs/ARCHITECTURE.md` - Architecture système
- 📚 `docs/API.md` - Documentation API
- 📚 `README.md` - Guide principal
- 📚 `backend/README.md` - Guide backend
- 📚 `frontend/README.md` - Guide frontend

## ✅ Checklist Final

- [x] Backend dans `backend/` avec structure propre
- [x] Frontend renommé `gestion/` → `frontend/`
- [x] Backend package.json et Dockerfile créés
- [x] Frontend Dockerfile copié
- [x] docker-compose.yml mise à jour avec nouveaux chemins
- [x] Variables d'environnement créées
- [x] Documentation ARCHITECTURE.md
- [x] Documentation API.md
- [x] README.md mis à jour
- [x] Backend et Frontend README créés
- [ ] Lancer `docker-compose up --build` et tester
- [ ] Tester authentification (register/login)
- [ ] Tester CRUD projets/notes
- [ ] Vérifier MySQL (PhpMyAdmin)
- [ ] Vérifier Minio S3
- [ ] Nettoyer les fichiers legacy (Dockerfile.backend, server.js root)

## 🎯 Prochaines Étapes

1. ✅ Tester tout fonctionne avec docker-compose
2. ✅ Supprimer les fichiers legacy au root:
   - `Dockerfile.backend`
   - `server.js` (déjà dans backend/src/)
   - `package.json` à root (déjà dans backend/)
3. ✅ Ajouter CI/CD (GitHub Actions)
4. ✅ Setup environnement de production
5. ✅ Déployer sur serveur (AWS, Heroku, etc.)

---

**Status**: ✅ Structure prête pour tests!

Lancez: `docker-compose up --build`
