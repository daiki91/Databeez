# Databeez - Application de Gestion de Projets

## 📋 Description

Databeez est une application web moderne de gestion de projets permettant de :
- **S'authentifier** : Inscription et connexion sécurisées (email ou téléphone)
- **Gérer des projets** : Création et organisation de projets par utilisateur
- **Gérer les notes** : Ajout et suppression de notes d'avancement datées
- **Stocker les données** : Notes persistantes sur Minio (S3-compatible) et utilisateurs/projets en MySQL

### ✨ Fonctionnalités principales
- 🔐 **Authentification JWT** : Inscription/connexion avec email ou téléphone
- 📁 **Gestion des projets** : Création et organisation de projets
- 📝 **Notes d'avancement** : Historique chronologique avec dates
- 🎨 **Interface moderne** : Design épuré avec Tailwind CSS
- 🌓 **Thème clair/sombre** : Toggle de thème avec persistance
- 📱 **Responsive** : Optimisé pour mobile, tablette et desktop
- ⚡ **Performances** : Animations fluides avec Framer Motion
- 🔄 **Gestion d'état** : React Query pour une gestion API efficace
- ✅ **Validation** : Formulaires avec React Hook Form et Zod

## 🏗️ Architecture

### Backend (Node.js + Express)
- API RESTful avec Express.js
- Authentification JWT (Bearer tokens)
- Endpoints pour : authentification, projets et notes
- Intégration MySQL pour utilisateurs et projets
- Intégration Minio (S3) pour les notes

### Frontend (React 19 + Vite)
- Interface moderne avec **TailwindCSS 3.3**
- Navigation avec **React Router 6**
- Gestion API avec **React Query 5**
- Formulaires avec **React Hook Form** + **Zod**
- Animations fluides avec **Framer Motion**
- Icônes avec **Lucide React**
- Notifications avec **Sonner**
- Support thème clair/sombre

### Base de données
- **MySQL** : Utilisateurs, projets et métadonnées
- **Minio (S3)** : Stockage des notes au format JSON

### Conteneurisation
- **Docker & Docker Compose** : Orchestration des services

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

## Prérequis
- Docker et Docker Compose installés
- Node.js (version 16 ou supérieure) pour le développement local
- Git

## 🚀 Installation et Lancement

### 1. Cloner le dépôt
```bash
git clone <url-du-depot>
cd databeez
```

### 2. Lancer tous les services avec Docker Compose
```bash
docker-compose up --build
```

Cela démarre automatiquement :
- **Backend** : http://localhost:3000
- **Frontend** : http://localhost:5173 (à lancer manuellement, voir étape 6)
- **MySQL** : Port 3306
- **Minio** : http://localhost:9000 (Console : localhost:9000, credentials: minioadmin/minioadmin)

### 3. Installer les dépendances du backend (optionnel si Docker suffisant)
```bash
npm install
```

### 4. Installer les dépendances du frontend
```bash
cd gestion
npm install
cd ..
```

### 5. Créer le fichier de configuration du frontend
```bash
cp gestion/.env.example gestion/.env.local
```

Les valeurs par défaut devraient fonctionner en local.

### 6. Lancer le frontend en développement
```bash
cd gestion
npm run dev
```

Le frontend sera disponible sur **http://localhost:5173**

### ✅ Votre application est prête !
1. Accédez à http://localhost:5173
2. Créez un compte (email ou téléphone + mot de passe)
3. Commencez à gérer vos projets !

## 💡 Utilisation

### 1. Authentification
Accédez à http://localhost:5173
- **Nouvelle inscription** : Cliquez sur "S'inscrire" et entrez email/téléphone + mot de passe (min. 6 caractères)
- **Connexion** : Utilisez vos identifiants créés

### 2. Tableau de bord
Après connexion, découvrez :
- Vue d'ensemble avec statistiques
- Accès rapide aux projets récents
- Message de bienvenue personnalisé

### 3. Gérer vos projets
- **Créer** : Cliquez sur "Nouveau projet" et remplissez titre + description
- **Organiser** : Recherchez, triez par date ou alphabétiquement
- **Consulter** : Cliquez sur un projet pour voir les détails et les notes

### 4. Ajouter des notes
Dans un projet :
- Cliquez sur "Ajouter une note"
- Saisissez titre et description
- Les notes s'affichent dans un historique chronologique
- Supprimez les notes en cliquant sur l'icône poubelle

### 5. Interface
- 🌓 Basculez entre thème clair/sombre (bouton en haut à droite)
- 📱 L'interface s'adapte à votre écran (mobile, tablette, desktop)
- ⚡ Les animations fluides rendent l'expérience agréable

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
# Mode développement
npm run dev

# Démarrage normal
npm start
```

### Scripts Docker
```bash
# Démarrer tous les services
docker-compose up

# Démarrer en arrière-plan
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f mysql
docker-compose logs -f minio
```

### Débogage

#### Frontend
- **Port Vite** : http://localhost:5173
- **Outils Chrome DevTools** : F12 pour inspecter l'interface React
- **Vérifier les imports** : Assurez-vous que les chemins d'importation sont corrects
- **Tokens JWT** : Les tokens s'affichent dans les en-têtes Authorization (Network tab)
- **Dark mode** : Testez le basculement thème en haut à droite

#### Backend
- **Port API** : http://localhost:3000
- **Test endpoints** : Utilisez Postman ou Thunder Client
- **Base de données** : Connectez-vous avec MySQL Workbench (localhost:3306, root/password)
- **Minio Console** : http://localhost:9000 (minioadmin/minioadmin)

### Troubleshooting

**Erreur : "API_URL not found"**
- Vérifiez le fichier `gestion/.env.local`
- Assurez-vous que `VITE_API_URL=http://localhost:3000/api` est défini

**Erreur : "Cannot find module"**
- Exécutez `npm install` dans le répertoire (frontend ou backend)
- Vérifiez les chemins relatifs dans les imports

**Base de données ne démarre pas**
- Vérifiez que le port 3306 n'est pas utilisé par une autre instance MySQL
- Nettoyez les volumes Docker : `docker-compose down -v`

**Minio ne répond pas**
- Vérifiez que le port 9000 n'est pas occupé
- Consultez les logs : `docker-compose logs minio`

**Token expiré / Non autorisé**
- Reconnectez-vous à l'application
- Supprimez les cookies/localStorage et rafraîchissez la page

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

## Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout de nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT."# Databeez" 
