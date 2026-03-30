# 📊 Databeez - Gestionnaire de Projets Moderne

> **Application web complètement conteneurisée** pour gérer vos projets et notes d'avancement avec authentification sécurisée.
>
> Développée par **daiki91** | Conçue avec React, Node.js et Docker

## 🏗️ Structure du Projet

```
databeez/
├── backend/                      ← API Node.js + Express
│   ├── src/
│   │   └── server.js            # Serveur principal
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── .env
│   └── README.md               # Documentation backend
│
├── frontend/                      ← Interface React + Vite
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── Dockerfile.frontend      # (deprecated, voir Dockerfile)
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env
│   ├── .npmrc
│   └── README.md               # Documentation frontend
│
├── docs/                         ← Documentation
│   ├── ARCHITECTURE.md
│   └── API.md
│
├── docker-compose.yml           ← Orchestration des conteneurs
├── sqlScrip.sql                 ← Schéma MySQL
├── package.json                 ← (Legacy, non utilisé)
├── server.js                    ← (Legacy, voir backend/src/)
├── README.md                    ← Ce fichier
├── CAHIER_DE_CHARGE.md
└── .gitignore
```

### 📚 Hiérarchie

- **`/backend`** - Service API REST (Node.js, port 3000)
- **`/frontend`** - Application web (React, port 5173)
- **`docker-compose.yml`** - Orchestre tous les services (backend, frontend, MySQL, Minio, PhpMyAdmin)

## 📋 Description de la Solution

**Databeez** est une plateforme complète de gestion de projets et de suivi d'avancement conçue pour les équipes et les individus souhaitant organiser leur travail efficacement.

### 🎯 Problème Résolu
Gérer plusieurs projets avec leurs notes d'avancement en temps réel, avec une interface intuitive, sécurisée et facilement déployable.

### ✨ Avantages Clés
- 🔐 **Sécurisée** - Authentication JWT, hashage bcrypt des mots de passe
- 🚀 **Performante** - React Query cache intelligent, Vite bundler ultra-rapide
- 📱 **Responsive** - Fonctionne parfaitement sur mobile, tablette et desktop
- 🐳 **Déployable** - Complètement dockerisée avec docker-compose
- 🎨 **Moderne** - Interface élégante avec TailwindCSS et animations Framer Motion
- 💾 **Scalable** - Stockage dual: MySQL pour la structure, Minio S3 pour les fichiers

### 💡 Cas d'Usage
- Suivi de projets personnels
- Gestion d'équipe avec notes historisées
- Documentation d'avancement par jour/sprint
- Archivage sécurisé avec versionning automatique

## ✨ Fonctionnalités Principales

- 🔐 **Authentification JWT** - Inscription/connexion avec email ou téléphone + mot de passe
- 📁 **Gestion des Projets** - Créer, organiser et supprimer vos projets
- 📝 **Notes d'Avancement** - Ajouter des notes datées et historisées par projet
- 💾 **Stockage Dual** - MySQL pour la structure, Minio S3 pour les fichiers
- 🎨 **Interface Moderne** - Design responsive avec TailwindCSS + animations Framer Motion
- 🌓 **Thème Clair/Sombre** - Toggle de thème avec persistance
- 📱 **Responsive Design** - Fonctionne sur mobile, tablette et desktop
- 🚀 **Performance Optimisée** - React Query pour cache intelligent, Vite ultra-rapide
- ✅ **Validation Robuste** - Zod pour validation schémas, React Hook Form pour formulaires

## 🏗️ Architecture Complète

### Backend (Node.js + Express)
```
Port: 3000 (http://localhost:3000)
- API RESTful avec Express.js
- Authentification JWT avec tokens 8h
- Hashage des mots de passe avec bcrypt
- Pool de connexions MySQL
- Intégration Minio pour stockage S3
- CORS activé pour développement
```

### Frontend (React 19 + Vite)
```
Port: 5173 (http://localhost:5173)
- React Router 6 pour navigation
- React Query 5 pour cache API intelligent
- TailwindCSS 3.3.6 pour styling
- Framer Motion 10 pour animations
- React Hook Form + Zod pour validation
- Context API pour auth/theme
- Lucide React pour icônes
- Sonner pour toast notifications
```

### Base de Données
```
MYSQL (Port 3306)
- Utilisateurs avec email/phone uniques
- Projets avec timestamps
- Notes avec foreign keys CASCADE
- Initialisé automatiquement au démarrage

PhpMyAdmin (Port 8080)
- Interface web pour gérer la BD
- Admin MySQL pour debugging
```

### Stockage Objet
```
MINIO (Port 9000)
- Compatible S3
- Bucket: databeez-notes
- Stocke notes en JSON
- Console web incluse
```

### Réseau Docker
```
- Tous les conteneurs sur même réseau
- Communication interne via noms de service
- Frontend → Backend via http://localhost:3000
- Backend → MySQL via host "mysql" (interne)
- Backend → Minio via host "minio" (interne)
```

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** (v14+) - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de données relationnelle
- **Minio** - Stockage S3-compatible
- **JWT** - Authentification sécurisée

### Frontend
- **React** 19.2.4 - Framework UI
- **Vite** - Bundler ultra-rapide
- **TailwindCSS** 3.3.6 - Styling utilitaire
- **React Router** 6.20 - Navigation
- **@tanstack/react-query** 5.28 - Gestion API
- **react-hook-form** 7.48 - Gestion formulaires
- **Zod** 3.22 - Validation schémas
- **Framer Motion** 10.16 - Animations
- **Lucide React** 0.408 - Icônes
- **Sonner** 1.3 - Notifications toast
- **date-fns** 2.30 - Manipulation des dates

### Infrastructure
- **Docker** & **Docker Compose** - Conteneurisation

## 🛠️ Prérequis

### ⚙️ Obligatoire
- **Docker Desktop** installé et actif
  - Vérifiez: `docker --version` et `docker-compose --version`
  - Windows/Mac: Téléchargez depuis https://www.docker.com/products/docker-desktop
  - Linux: `sudo apt install docker.io docker-compose`
  
### ✅ Optionnel (pour développement local)
- **Node.js** v20+ (pour lancer le code en local sans Docker)
- **Git** (pour cloner le repository)
- **Postman** ou **Thunder Client** (pour tester l'API)
- **MySQL Workbench** (pour debug base de données)

---

## 🚀 Instructions de Lancement

### ⏱️ Durée estimée : 5-10 minutes

### Étape 1️⃣ : Préparer le Projet
```bash
# Cloner le repository
git clone <url-du-repository>
cd databeez

# Vérifier la structure
ls -la docker-compose.yml
ls -la gestion/
ls -la .
```

✅ Vous devez avoir :
- `docker-compose.yml` (orchestration des conteneurs)
- `gestion/` (dossier du frontend React)
- `server.js` (serveur backend)
- `sqlScrip.sql` (schéma MySQL)

---

### Étape 2️⃣ : Lancer l'Application

#### Option A : Lancement Standard (Recommandé)
```bash
# Démarrer tous les conteneurs Docker
docker-compose up --build

# Attendez 30-60 secondes pour que tous les conteneurs se lancent
# Vous devez voir ces lignes (ou similaires):
# ✅ databeez-mysql is ready
# ✅ minio has started
# ✅ Backend server listening on port 3000
# ✅ VITE v4.x.x ready in XXXms
```

#### Option B : Lancement en Arrière-Plan
```bash
# Lancer en daemon mode (sans afficher les logs)
docker-compose up -d --build

# Vérifier que tout est lancé
docker-compose ps

# Voir les logs en temps réel si besoin
docker-compose logs -f
```

#### Option C : Arrêter l'Application
```bash
# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer tous les volumes (données MySQL/Minio)
docker-compose down -v
```

---

### Étape 3️⃣ : Vérifier que Tout Fonctionne

Ouvrez chaque URL dans votre navigateur :

| Service | URL | ✅ Statut Attendu | Identifiants |
|---------|-----|------------------|--------------|
| **Frontend** | http://localhost:5173 | Page login/register | N/A |
| **Backend API** | http://localhost:3000/api | Page blanche (OK) | N/A |
| **API Health** | http://localhost:3000/api/health | `{"status":"ok"}` | N/A |
| **PhpMyAdmin** | http://localhost:8080 | Interface MySQL | user: `root` / pass: `password` |
| **Minio Console** | http://localhost:9000 | Interface web | user: `minioadmin` / pass: `minioadmin` |

✅ **Si Au moins le Frontend s'affiche, vous êtes bon! Les autres sont optionnels pour déboguer.**

---

### Étape 4️⃣ : Créer un Premier Compte

1. Allez sur http://localhost:5173
2. Cliquez sur "S'inscrire"
3. Remplissez avec :
   ```
   Email: test@example.com
   OU Téléphone: +33612345678
   Mot de passe: password123
   ```
4. Cliquez "S'inscrire"
5. ✅ Vous devez être redirigé vers le **Dashboard**

---

### Étape 5️⃣ : Tester les Fonctionnalités

#### Test 1: Créer un Projet
1. Cliquez sur "Projets" dans le sidebar
2. Cliquez "Nouveau projet"
3. Remplissez:
   ```
   Titre: Mon Premier Projet
   Description: Ceci est mon premier projet
   ```
4. Cliquez "Créer"
5. ✅ Projet doit apparaître dans la liste

#### Test 2: Ajouter une Note
1. Cliquez sur le projet créé
2. Remplissez le formulaire "Nouvelle note":
   ```
   Titre: Day 1 Progress
   Description: Mise en place de la structure
   ```
3. Cliquez "Ajouter"
4. ✅ Note doit s'afficher

#### Test 3: Changer de Thème
1. Cliquez l'icône Soleil/Lune en haut à droite
2. ✅ L'interface doit passer en mode sombre/clair

---

## 📸 Captures d'Écran de la Solution Fonctionnelle

### 🔐 Page de Connexion/Inscription
```
URL: http://localhost:5173/
Affichage: Form modern avec:
  • Champ Email ou Téléphone
  • Champ Mot de passe
  • Bouton "Connexion" ou "S'inscrire"
  • Toggle clair/sombre en haut à droite
  • Design responsive (mobile-first)
```

**Caractéristiques:**
- ✅ Logo Databeez prédominant à gauche
- ✅ Formulaires validés en temps réel (Zod)
- ✅ Messages d'erreur détaillés
- ✅ Navigation vers signup/signin

---

### 📊 Page Dashboard
```
URL: http://localhost:5173/dashboard
Affichage:
  • En-tête: "Bienvenue, [email]"
  • Statistiques: Nombre de projets, Notes totales
  • Liste des 6 derniers projets en grille responsive
  • Icônes Lucide React
  • Signature: "Designed & Built by daiki91"
```

**Caractéristiques:**
- ✅ Statistiques en cartes colorées avec icônes
- ✅ Grille responsive (1 col mobile → 3 cols desktop)
- ✅ Bouton "Voir tous" vers page projets
- ✅ Animations Framer Motion fluides
- ✅ No-data state élégant si aucun projet

---

### 📁 Page Mes Projets
```
URL: http://localhost:5173/projects
Affichage:
  • Titre: "Mes Projets"
  • Barre de recherche (filtrage en temps réel)
  • Dropdown tri: "Plus récent" vs "Alphabétique"
  • Bouton "Nouveau projet" (bleu)
  • Grille de cartes projets responsive (1-4 colonnes)
```

**Caractéristiques Cartes:**
- ✅ Titre du projet (2 lignes max)
- ✅ Description (3 lignes max)
- ✅ Date de création
- ✅ Badge "X notes" en couleur primaire
- ✅ Hover effect (shadow + animation)
- ✅ Click → détail du projet

**Tailles Grille:**
- 📱 Mobile:     1 colonne
- 📱 Tablette:   2 colonnes
- 💻 Desktop:    3 colonnes
- 🖥️ Grand écran: 4 colonnes

---

### 📝 Page Détail Projet
```
URL: http://localhost:5173/projects/:id
Affichage:
  • Titre du projet en grand
  • Description du projet
  • Formulaire "Ajouter une note"
  • Liste de toutes les notes du projet
  • Bouton retour/delete du projet
```

**Formulaire Note:**
- ✅ Champ Titre (requis)
- ✅ Champ Description (optionnel, textarea)
- ✅ Validation React Hook Form
- ✅ Bouton "Ajouter"

**Liste Notes:**
- ✅ Chaque note affiche: titre, description, date, actions
- ✅ Bouton Éditer (futur)
- ✅ Bouton Supprimer (avec confirmation)
- ✅ Historique complet des modifications

---

### 👤 Page Profil Utilisateur
```
URL: http://localhost:5173/profile
Affichage:
  • Avatar initiales
  • Email/Téléphone
  • Informations du compte
  • Bouton Déconnexion
  • Dark/Light toggle
```

---

### 🌓 Mode Sombre/Clair
```
Activation: Icône Soleil/Lune en haut navbar
État:
  • Mode Sombre: Fond #0f172a, texte blanc
  • Mode Clair: Fond blanc, texte #0f172a
Persistance: localStorage ('theme')
Préférence OS: Système détecte prefers-color-scheme
```

**Couleurs Appliquées:**
- 🟠 Primary: Gradient mauve (#7c3aed → #6d28d9)
- 🔵 Secondary: Bleu ciel (#0ea5e9)
- 🔴 Accent: Rouge (#ef4444)
- ⚪ Neutre: Slate (50-950)

---

### 🎨 Interface Responsive
```
Breakpoints Tailwind:
  • sm (640px):   Sidebar cache sur mobile
  • md (768px):   2 colonnes pour grilles
  • lg (1024px):  3 colonnes
  • xl (1280px):  4 colonnes

Sidebarr Navigation:
  • Affichée sur desktop
  • Mobile menu (toggle burger)
  • Liens: Dashboard, Projects, Profile
  • Icônes Lucide React colorées
```

---

## 🛠️ Prérequis

### ⚙️ Obligatoire
- **Docker Desktop** installé et actif
  - Vérifiez: `docker --version` et `docker-compose --version`
  - Windows/Mac: Téléchargez depuis https://www.docker.com/products/docker-desktop
  - Linux: `sudo apt install docker.io docker-compose`
  
### ✅ Optionnel (pour développement local)
- **Node.js** v20+ (pour lancer le code en local sans Docker)
- **Git** (pour cloner le repository)
- **Postman** ou **Thunder Client** (pour tester l'API)
- **MySQL Workbench** (pour debug base de données)

---

## 🚀 Installation Rapide (5 minutes)

### Étape 1️⃣: Cloner le Projet
```bash
git clone <url-du-repository>
cd databeez
```

### Étape 2️⃣: Lancer les Conteneurs
```bash
docker-compose up --build
```

⏳ **Attendez ~30 secondes** que tout démarre. Vous devez voir:
```
✅ minio 
✅ databeez-mysql
✅ databeez-phpmyadmin
✅ databeez-backend (Serveur lancé sur port 3000)
✅ databeez-frontend (VITE ready in XXX ms)
```

### Étape 3️⃣: Vérifier que Tout fonctionne
Ouvrez dans le navigateur:

| Service | URL | Statut Attendu |
|---------|-----|----------------|
| **Frontend** | http://localhost:5173 | Page d'inscription/connexion |
| **Backend API** | http://localhost:3000 | JSON liste des endpoints |
| **API Status** | http://localhost:3000/api | `{"status":"ok"}` |
| **PhpMyAdmin** | http://localhost:8080 | Interface de gestion MySQL |
| **Minio Console** | http://localhost:9000 | Connexion admin/passer123 |

✅ **Si tout est accessible, vous êtes prêt!**

---

## 📚 Utilisation Complète

### 1️⃣ Inscription

**URL**: http://localhost:5173/register

**Test avec:**
```
Email: test@example.com
OU Téléphone: +33612345678
Mot de passe: password123 (minimum 6 caractères)
```

**Comportement attendu:**
1. ✅ Validation du formulaire (6 chars min)
2. ✅ Toast "Inscription réussie !"
3. ✅ Redirection automatique au dashboard
4. ✅ Token JWT sauvegardé en localStorage

**Vérification en BD:**
```
http://localhost:8080
→ databeez/users
→ Vous devez voir votre utilisateur créé
```

### 2️⃣ Connexion

**URL**: http://localhost:5173 (page par défaut)

**Utilisez les mêmes identifiants que l'inscription**

### 3️⃣ Créer un Projet

**Dans le dashboard:**
1. Cliquez sur "Projets" dans la sidebar
2. Cliquez "Créer un projet"
3. Remplissez:
   ```
   Titre: Mon Premier Projet
   Description: Description optionnelle
   ```
4. ✅ Projet apparaît dans la liste

**Vérification en BD:**
```
http://localhost:8080
→ databeez/projects
→ Vous devez voir le projet créé
```

### 4️⃣ Ajouter une Note

**Dans la page du projet:**
1. Cliquez sur un projet dans la liste
2. Remplissez le formulaire "Ajouter une note":
   ```
   Titre: Note du Day 1
   Description: Contenu détaillé
   ```
3. ✅ Note sauvegardée et affichée

**Vérification en BD:**
```
http://localhost:8080
→ databeez/notes
→ Vous devez voir la note créée

http://localhost:9000 (Minio)
→ Bucket: databeez-notes
→ Fichier: notes/{noteId}.json
```

### 5️⃣ Thème Clair/Sombre

Cliquez sur l'icône soleil/lune en haut à droite (dans le navbar).

- ✅ Thème bascule en temps réel
- ✅ Préférence sauvegardée en localStorage
- ✅ Système détecte la préférence OS

### 6️⃣ Suppression

**Supprimer une note:**
- Cliquez l'icône poubelle sur la note
- ✅ Note supprimée de MySQL et Minio

**Supprimer un projet:**
- Cliquez le bouton supprimer du projet
- ✅ Projet et ses notes supprimés en cascade

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Inscription
  - Body: `{ "email": "string", "phone": "string", "password": "string" }`
- `POST /api/auth/login` - Connexion
  - Body: `{ "email": "string", "phone": "string", "password": "string" }`
  - Response: `{ "token": "jwt_token" }`
- `GET /api/auth/me` - Infos utilisateur (nécessite Authorization header)

### Projets
- `GET /api/projects` - Récupérer tous les projets (utilisateur authentifié)
- `POST /api/projects` - Créer un projet
  - Body: `{ "title": "string", "description": "string" }`
- `PUT /api/projects/:id` - Modifier un projet (non implémenté)
- `DELETE /api/projects/:id` - Supprimer un projet (non implémenté)

### Notes
- `GET /api/projects/:projectId/notes` - Récupérer les notes d'un projet
- `POST /api/projects/:projectId/notes` - Créer une note
  - Body: `{ "title": "string", "description": "string" }`
- `PUT /api/notes/:id` - Modifier une note (non implémenté)
- `DELETE /api/notes/:id` - Supprimer une note

**En-tête requis pour les routes protégées** :
```
Authorization: Bearer {token}
```

## ⚙️ Configuration

### Backend (Variables d'environnement)
```bash
# .env (à créer)
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=databeez
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
JWT_SECRET=your-secret-key
PORT=3000
```

### Frontend (Variables d'environnement)
```bash
# gestion/.env.local
VITE_API_URL=http://localhost:3000/api
```

### Minio (S3-compatible)
Configuré via docker-compose.yml :
- **URL Console** : http://localhost:9000
- **Access Key** : minioadmin
- **Secret Key** : minioadmin
- **Bucket** : databeez-notes
- **Port** : 9000

### MySQL
Configuré via docker-compose.yml :
- **Host** : localhost
- **Port** : 3306
- **User** : root
- **Password** : password
- **Database** : databeez

## � Troubleshooting Complet

### ❌ Problème : Port déjà utilisé
**Symptôm:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
```bash
# Trouver le processus utilisant le port 3000
netstat -ano | findstr :3000  (Windows)
lsof -i :3000                  (Mac/Linux)

# Tuer le processus
taskkill /PID <PID> /F         (Windows)
kill -9 <PID>                  (Mac/Linux)

# OU simplement changer le port dans docker-compose.yml
ports:
  - "3001:3000"  # Au lieu de 3000
```

### ❌ Problème : ERR_NAME_NOT_RESOLVED (Frontend ne contacte pas Backend)
**Symptôm:** Erreur réseau lors du login/inscription, Chrome affiche `ERR_NAME_NOT_RESOLVED: backend`

**Cause:** Le frontend tente de contacter `http://backend:3000/api` (nom DNS Docker invalide depuis le navigateur)

**Solution:**
```yaml
# docker-compose.yml - IMPORTANT!
services:
  frontend:
    environment:
      VITE_API_URL: http://localhost:3000/api  # ✅ Pas http://backend:3000/api !
```

```javascript
// gestion/src/services/api.js
const baseURL = 'http://localhost:3000/api';  // ✅ Toujours localhost!
```

> **⚠️ Note:** Frontend = navigateur = ne voit pas les noms Docker service. Utilisez toujours `localhost` depuis le browser.

### ❌ Problème : Erreur npm install (Peer Dependencies)
**Symptôm:** `npm ERR! ERESOLVE unable to resolve dependency tree`

**Cause:** React 19 + lucide-react@0.294 ne sont pas compatibles ensemble

**Solutions:**

**Option 1: Fichier .npmrc (RECOMMANDÉ)**
```bash
# gestion/.npmrc
legacy-peer-deps=true
```

**Option 2: Flag CLI**
```bash
cd gestion
npm install --legacy-peer-deps
npm ci --legacy-peer-deps
```

**Option 3: Vérifier versions installées**
```bash
npm list react lucide-react
# Doit être:
# react@19.2.4
# lucide-react@0.408 (minimum!)
```

### ❌ Problème : MySQL ne démarre pas
**Symptôm:** `docker-compose logs mysql` affiche erreurs de démarrage

**Solutions:**

**1. Nettoyage complet:**
```bash
# Supprimer tous les volumes et conteneurs
docker-compose down -v

# Redémarrer
docker-compose up --build
```

**2. Vérifier le port:**
```bash
# Vérifier que 3306 n'est pas utilisé
netstat -ano | findstr :3306  (Windows)

# Sinon changer dans docker-compose.yml
ports:
  - "3307:3306"
```

**3. Vérifier les credentials:**
```yaml
# docker-compose.yml
mysql:
  environment:
    MYSQL_ROOT_PASSWORD: password     # ✅ Must match server.js
    MYSQL_DATABASE: databeez
```

```javascript
// server.js
const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'password',  // ✅ Doit correspondre!
  database: 'databeez'
});
```

### ❌ Problème : Frontend affiche page blanche
**Symptôm:** http://localhost:5173 affiche page vide, pas d'erreurs visibles

**Solutions:**

```bash
# 1. Vérifier les logs Vite
docker-compose logs frontend

# 2. Vérifier la console du navigateur (F12 > Console)
# Cherchez erreurs JS

# 3. Forcer rebuild
docker-compose down
docker-compose up --build

# 4. Vérifier main.jsx
# gestion/src/main.jsx doit avoir:
import React from 'react'
import App from './App'
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

### ❌ Problème : Minio ne répond pas
**Symptôm:** Impossible d'accéder http://localhost:9000

**Solutions:**

```bash
# 1. Vérifier le conteneur
docker ps | findstr minio
docker-compose logs minio

# 2. Vérifier le port
netstat -ano | findstr :9000

# 3. Vérifier les credentials
# docker-compose.yml:
environment:
  MINIO_ROOT_USER: minioadmin
  MINIO_ROOT_PASSWORD: passer123  # Attention: c'est "passer123" pas "minioadmin"!

# 4. Redémarrer
docker-compose restart minio
```

### ❌ Problème : Inscription/Login ne fonctionne pas (formulaire)
**Symptôm:** Bouton "S'inscrire" ne répond pas, pas d'erreur visible

**Solutions:**

**1. Tester l'API en Direct (Postman/Terminal):**
```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Response attendue:
{"id":1,"email":"test@example.com","token":"eyJhbGc..."}
```

✅ Si Postman fonctionne mais le formulaire non → problème frontend
❌ Si Postman échoue → problème backend

**2. Si API fonctionne, déboguer le formulaire:**
```javascript
// gestion/src/pages/Register.jsx - Ajouter console.log
const registerMutation = useMutation({
  mutationFn: async (data) => {
    console.log('Submitting:', data);  // ← Vérifier données
    const response = await api.post('/auth/register', data);
    console.log('Response:', response);  // ← Vérifier réponse
    return response.data;
  },
  onSuccess: (data) => {
    console.log('Success:', data);
    localStorage.setItem('token', data.token);
    // ... reste du code
  }
});
```

**3. Vérifier la validation Zod:**
```javascript
// gestion/src/utils/schemas.js
export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Min 6 caractères'),
  phone: z.string().optional()
});

// Tester avec console:
// registerSchema.parse({email: 'test@test.com', password: 'pass123'})
```

### ❌ Problème : "Token invalide" ou "Non autorisé"
**Symptôm:** Erreur 401 après connexion, impossible d'accéder au dashboard

**Solutions:**

```bash
# 1. Vérifier le token en localStorage
# F12 > Application > Local Storage > localhost:5173
# Clé: "token"
# Doit contenir un JWT (eyJ...)

# 2. Tester le token avec l'API
curl -H "Authorization: Bearer <votre_token>" \
  http://localhost:3000/api/auth/me

# Si ça marche → problème intercept axios
# Si ça échoue → problème token expiré ou invalide
```

```javascript
// gestion/src/services/api.js - Vérifier les interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token envoyé:', token.substring(0, 20) + '...');  // Debug
  }
  return config;
});
```

**3. Si token expiré (> 8h):**
```bash
# Se reconnecter simplement
# Token va être régénéré
```

### ❌ Problème : Création de projet/note échoue
**Symptôm:** Erreur 500 ou 403 lors de création

**Solutions:**

```bash
# 1. Vérifier les logs backend
docker-compose logs backend

# 2. Tester avec Postman (avec le token)
POST http://localhost:3000/api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Mon Projet",
  "description": "Description"
}

# Vérifier la réponse
```

```javascript
// gestion/src/pages/Projects.jsx - Debug mutation
const createProjectMutation = useMutation({
  mutationFn: async (data) => {
    console.log('Creating project:', data);
    try {
      const response = await api.post('/projects', data);
      console.log('Project created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Creation failed:', error.response?.data);
      throw error;
    }
  }
});
```

---

## 🔧 Développement

### Scripts Frontend
```bash
cd gestion

# Mode développement avec hot reload
npm run dev

# Build pour la production
npm run build

# Prévisualisation du build
npm run preview

# Linting avec ESLint
npm run lint
```

### Scripts Backend
```bash
# Mode développement (si local)
npm run dev

# Démarrage normal
npm start
```

### Scripts Docker Utiles
```bash
# Démarrer tous les services
docker-compose up

# Démarrer en arrière-plan
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs en temps réel
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
docker-compose logs -f minio

# Rebuild sans cache
docker-compose up --build --no-cache

# Supprimer les volumes (reset DB)
docker-compose down -v
docker-compose up --build

# Redémarrer un service
docker-compose restart backend

# Exécuter une commande dans un conteneur
docker-compose exec backend npm list
docker-compose exec mysql mysql -u root -p databeez
```

### Inspection et Débogage

#### Frontend (React 19)
- **Port Vite** : http://localhost:5173
- **Chrome DevTools** : F12 pour inspecter l'interface
- **Network tab** : Vérifier requêtes API et réponses
- **Console** : Chercher les erreurs JavaScript
- **Application tab** : Vérifier localStorage → token JWT
- **React DevTools** : Extension Chrome pour inspeter composants

#### Backend (Node.js)
```bash
# 1. Vérifier endpoints disponibles
curl http://localhost:3000

# 2. Tester registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# 3. Vérifier logs
docker-compose logs -f backend

# 4. Accéder au conteneur
docker-compose exec backend /bin/sh
npm list
```

#### Base de Données
```bash
# Accédez à PhpMyAdmin
http://localhost:8080
# Server: mysql
# Username: root
# Password: password

# OU via terminal
docker-compose exec mysql mysql -u root -p
# Password: password

mysql> USE databeez;
mysql> SELECT * FROM users;
mysql> SELECT * FROM projects;
mysql> SELECT * FROM notes;
```

#### Minio / S3 Storage
```bash
# Console web
http://localhost:9000
# Username: minioadmin
# Password: passer123

# Vérifier les fichiers
# Bucket: databeez-notes
# Folder: notes/
# Files: {noteId}.json
```

### Hot Reload & Rechargement

**Frontend:**
- ✅ Modifications `.jsx` → Auto-reload (< 1 seconde)
- ✅ Modifications `tailwind.config.js` → Auto-reload
- ✅ Modifications CSS → Auto-reload
- ❌ Ajout de dépendances → Redémarrer `npm run dev`

**Backend:**
- ❌ Les modifications ne se rechargent PAS automatiquement
- ✅ Redémarrez avec: `docker-compose restart backend`

**Minio / MySQL:**
- Les données persistent dans les volumes Docker
- Utilisez `docker-compose down -v` pour reset complètement

## Captures d'Écran

*(À ajouter une fois l'application fonctionnelle)*

- Page d'accueil avec la liste des projets
- Interface de création d'un projet
- Gestion des notes dans un projet

## 📂 Structure du Projet

```
databeez/
├── docker-compose.yml          # Configuration Docker
├── Dockerfile.backend          # Build backend
├── package.json                # Dépendances backend
├── server.js                   # Point d'entrée backend
├── sqlScript.sql               # Initialisation base de données
├── CAHIER_DE_CHARGE.md         # Spécifications fonctionnelles
├── README.md                   # Cette documentation
│
└── gestion/                    # Frontend React
    ├── package.json            # Dépendances frontend
    ├── vite.config.js          # Configuration Vite
    ├── tailwind.config.js      # Configuration TailwindCSS
    ├── postcss.config.js       # Configuration PostCSS
    ├── eslint.config.js        # Configuration ESLint
    ├── .env.example            # Variables d'environnement
    ├── MODERNIZATION.md        # Documentation frontend
    ├── index.html              # Fichier HTML
    ├── public/                 # Assets statiques
    │
    └── src/
        ├── components/         # Composants réutilisables
        │   ├── common/        # (Button, Card, Input, Modal, Badge, LoadingSpinner)
        │   ├── layout/        # (Layout, Navbar, Sidebar)
        │   ├── projects/      # Composants projets
        │   ├── notes/         # Composants notes
        │   └── auth/          # Composants authentification
        │
        ├── pages/             # Pages principales
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   ├── Projects.jsx
        │   ├── ProjectDetail.jsx
        │   └── Toast.jsx
        │
        ├── contexts/          # Context API
        │   ├── AuthContext.jsx
        │   └── ThemeContext.jsx
        │
        ├── services/          # Appels API
        │   ├── api.js
        │   ├── authService.js
        │   └── projectService.js
        │
        ├── hooks/             # Hooks personnalisés
        │   └── index.js
        │
        ├── utils/             # Utilitaires
        │   ├── schemas.js     # Schémas Zod
        │   └── dateUtils.js   # Gestion dates
        │
        ├── styles/            # Styles CSS
        │   └── index.css      # Tailwind + styles globaux
        │
        ├── App.jsx            # Routeur principal
        ├── main.jsx           # Point d'entrée
        └── index.css          # Styles globaux
```

---

## ⚡ Commandes Rapides

### 🚀 Démarrage Complet (Recommandé)
```bash
# 1. Se placer dans le dossier du projet
cd databeez

# 2. Démarrer tous les services (MySQL, Minio, Backend, Frontend)
docker-compose up --build

# 3. Accéder à l'application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# PhpMyAdmin: http://localhost:8080
# Minio: http://localhost:9000

# 4. Se Inscrire
# Email: test@example.com
# Password: password123
# Thème: Cliquez l'icône soleil/lune pour basculer
```

### 🔄 Démarrage Sans Rebuild
```bash
docker-compose up
# (Plus rapide si aucune modification du code)
```

### 🛑 Arrêter tout
```bash
docker-compose down
```

### 🔧 Restart un service spécifique
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mysql
```

### 📊 Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
docker-compose logs -f minio
```

### 🧹 Nettoyer complètement (Reset DB)
```bash
docker-compose down -v
docker-compose up --build
# Redémarre à zéro, BD vide
```

### 🐛 Tester l'API avec curl
```bash
# 1. Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Récupérer profil (remplacez TOKEN)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/auth/me

# 4. Créer un projet (remplacez TOKEN)
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Project","description":"Test"}'

# 5. Récupérer les projets
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/projects
```

---

## 🎯 Prochaines Étapes Recommandées

### Pour Développement
1. **Frontend:**
   - Familiarisez-vous avec la structure React dans `gestion/src/`
   - Modifiez les composants pour tester le hot reload
   - Utilisez Chrome DevTools (F12) pour déboguer

2. **Backend:**
   - Consultez les endpoints disponibles: http://localhost:3000
   - Testez avec Postman ou curl
   - Modifiez `server.js` (nécessite restart: `docker-compose restart backend`)

3. **Database:**
   - Accédez PhpMyAdmin pour vérifier les données: http://localhost:8080
   - Explorez la structure des tables

### Pour Production
1. Builder le frontend: `cd gestion && npm run build`
2. Configurer variables d'environnement
3. Déployer sur un serveur (Heroku, Vercel, VPS)

### Pour Collaboration
1. Créer des branches feature: `git checkout -b feature/nom`
2. Tester complètement avant pull request
3. Documenter les changements

---

## 📝 Notes Importantes

⚠️ **Sécurité:**
- ❌ Ne commettez JAMAIS les fichiers `.env` avec les secrets
- ✅ Utilisez `.env.example` comme template
- ✅ Changez `MINIO_ROOT_PASSWORD` et `MYSQL_ROOT_PASSWORD` en production
- ✅ Utilisez une `JWT_SECRET` complexe en production

⚠️ **Performance:**
- ❌ Ne lancez pas `npm install` dans le Dockerfile sans `npm ci --legacy-peer-deps`
- ✅ Utilisez `docker-compose down -v` pour nettoyer les volumes inutilisés
- ✅ Vérifiez la taille des images: `docker images`

⚠️ **Réseau Docker:**
- ❌ Frontend ne peut PAS utiliser http://backend:3000 (nom DNS) depuis le navigateur
- ✅ Utilisez http://localhost:3000 depuis le navigateur
- ✅ Backend peut utiliser http://mysql et http://minio en interne

---

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout de nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, le modifier et le distribuez sous les conditions de la licence MIT.

---

## 📞 Support & Questions

Pour toute question ou problème:
1. Consultez d'abord la section **Troubleshooting** ci-dessus
2. Vérifiez les logs: `docker-compose logs -f`
3. Testez l'API directement avec curl ou Postman
4. Vérifiez que tous les ports sont accessibles

**Bonne chance DataBeez!**  
