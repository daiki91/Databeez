# Cahier des Charges - Application Databeez

## 🎯 Objectif

Concevoir une application simple de gestion de projets permettant de :
- Créer et gérer des projets (Titre, description, date de création)
- Ajouter des notes d'avancement datées sur des projets (titre de la note, description, date)
- Modifier et supprimer des notes
- Stocker les notes de manière persistante dans un bucket S3 sur Minio

## Contexte

Une entreprise souhaite suivre l'évolution de ses projets. Chaque projet peut contenir plusieurs notes d'avancement (mises à jour régulières datées), qui doivent être sauvegardées de manière persistante sur S3 via Minio.

## Fonctionnalités Principales

### Gestion des Projets
- Création de nouveaux projets avec titre et description
- Affichage des projets triés par date de création (plus récent en premier)
- Modification des informations d'un projet
- Suppression d'un projet (avec confirmation)

### Gestion des Notes d'Avancement
- Ajout de notes à un projet spécifique
- Chaque note contient :
  - Titre
  - Description
  - Date automatique (date de création)
- Modification d'une note existante
- Suppression d'une note
- Affichage des notes d'un projet, triées par date (plus récente en premier)

### Stockage
- Les notes sont stockées dans un bucket S3 sur Minio
- La base de données principale sera MySQL (hôte Docker)
- Les projets peuvent être stockés en base de données locale ou en mémoire pour la démonstration

## Livrables Attendus

### Code Source
- Dépôt GitHub/GitLab avec le code complet

### Backend (Node.js, API RESTful)
Base URL: `/api`

#### Endpoints Projets
- `GET /api/projects` → Récupérer tous les projets
- `POST /api/projects` → Créer un nouveau projet
  - Body: `{ "title": "string", "description": "string" }`
- `PUT /api/projects/:id` → Modifier un projet
  - Body: `{ "title": "string", "description": "string" }`
- `DELETE /api/projects/:id` → Supprimer un projet

#### Endpoints Notes
- `GET /api/projects/:projectId/notes` → Récupérer les notes d'un projet
- `POST /api/projects/:projectId/notes` → Créer une note pour un projet
  - Body: `{ "title": "string", "description": "string" }`
- `PUT /api/notes/:id` → Modifier une note
  - Body: `{ "title": "string", "description": "string" }`
- `DELETE /api/notes/:id` → Supprimer une note

### Frontend (React)
- Interface pour créer et afficher les projets
- Interface pour gérer les notes dans chaque projet
- Design simple et intuitif
- Utilisation de composants React pour la modularité

### Configuration Minio/S3
- Utilisation de Minio comme serveur S3 local
- Configuration via docker-compose
- Stockage des notes au format JSON dans le bucket

### README
- Instructions de lancement détaillées
- Description de l'architecture de la solution
- Captures d'écran de l'application fonctionnelle
- Technologies utilisées

## Technologies
- **Backend**: Node.js, Express.js
- **Frontend**: React, Vite
- **Stockage**: Minio (S3-compatible)
- **Conteneurisation**: Docker, Docker Compose

## Critères d'Acceptation
- L'application permet de créer, modifier et supprimer des projets
- L'application permet d'ajouter, modifier et supprimer des notes dans les projets
- Les notes sont persistées dans Minio/S3
- L'interface est fonctionnelle et responsive
- Le code est propre, commenté et versionné sur Git

## Procédure Minio
(cf. guide fourni : minio_docker_training_guide.pdf)