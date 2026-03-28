# Databeez - Application de Gestion de Projets

## Description

Databeez est une application web simple de gestion de projets permettant de créer et gérer des projets, ainsi que d'ajouter des notes d'avancement datées. Les notes sont stockées de manière persistante dans un bucket S3 sur Minio.

### Fonctionnalités
- **Gestion des Projets** : Création, modification, suppression et affichage des projets triés par date de création
- **Gestion des Notes** : Ajout, modification et suppression de notes d'avancement pour chaque projet
- **Stockage Persistant** : Utilisation de Minio (compatible S3) pour stocker les notes

## Architecture

### Backend (Node.js)
- API RESTful avec Express.js
- Endpoints pour les projets et les notes
- Intégration avec Minio pour le stockage S3

### Frontend (React)
- Interface utilisateur développée avec React et Vite
- Gestion des projets et notes via des composants modulaires

### Stockage
- Minio comme serveur S3 local via Docker
- Stockage des notes au format JSON

## Technologies Utilisées
- **Backend** : Node.js, Express.js
- **Frontend** : React, Vite
- **Stockage** : Minio (S3-compatible)
- **Conteneurisation** : Docker, Docker Compose

## Prérequis
- Docker et Docker Compose installés
- Node.js (version 16 ou supérieure) pour le développement local
- Git

## Installation et Lancement

### 1. Cloner le dépôt
```bash
git clone <url-du-depot>
cd databeez
```

### 2. Lancer Minio avec Docker Compose
```bash
docker-compose up -d || docker-compose up --build
```
Cela démarre Minio sur le port 9000 avec les credentials par défaut (minioadmin/minioadmin).

### 3. Installer les dépendances du backend
```bash
npm install
```

### 4. Installer les dépendances du frontend
```bash
cd gestion
npm install
cd ..
```

### 5. Lancer le backend
```bash
npm start
```
Le backend sera disponible sur http://localhost:3000

### 6. Lancer le frontend (dans un autre terminal)
```bash
cd gestion
npm run dev
```
Le frontend sera disponible sur http://localhost:5173

## Utilisation

1. Ouvrez votre navigateur et allez sur http://localhost:5173
2. Créez un nouveau projet en cliquant sur "Nouveau Projet"
3. Ajoutez des notes d'avancement à vos projets
4. Les notes sont automatiquement sauvegardées sur Minio

## API Documentation

### Projets
- `GET /api/projects` - Récupérer tous les projets
- `POST /api/projects` - Créer un projet
- `PUT /api/projects/:id` - Modifier un projet
- `DELETE /api/projects/:id` - Supprimer un projet

### Notes
- `GET /api/projects/:projectId/notes` - Récupérer les notes d'un projet
- `POST /api/projects/:projectId/notes` - Créer une note
- `PUT /api/notes/:id` - Modifier une note
- `DELETE /api/notes/:id` - Supprimer une note

## Configuration Minio

Minio est configuré via le docker-compose.yml :
- Port : 9000
- Console : http://localhost:9000
- Bucket par défaut : databeez-notes
- Access Key : minioadmin
- Secret Key : minioadmin

## Captures d'Écran

*(À ajouter une fois l'application fonctionnelle)*

- Page d'accueil avec la liste des projets
- Interface de création d'un projet
- Gestion des notes dans un projet

## Développement

### Scripts disponibles
- `npm start` (backend) : Lance le serveur en mode production
- `npm run dev` (backend) : Lance le serveur en mode développement
- `npm run dev` (frontend dans gestion/) : Lance Vite en mode développement

### Structure du Projet
```
databeez/
├── docker-compose.yml
├── package.json
├── server.js
├── CAHIER_DE_CHARGE.md
├── README.md
└── gestion/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        └── ...
```

## Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout de nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT."# Databeez" 
