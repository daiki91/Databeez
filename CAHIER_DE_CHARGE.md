# Cahier des Charges - Application Databeez

## 🎯 Objectif

Concevoir une application de gestion de projets avec authentification, permettant de :
- **Authentification** : Inscription et connexion (par email ou téléphone)
- Créer et gérer des projets (Titre, description, date de création) par utilisateur authentifié
- Ajouter des notes d'avancement datées sur des projets (titre de la note, description, date)
- Supprimer des notes
- Système de token-based authentication (Bearer JWT)

## Contexte

Une entreprise souhaite suivre l'évolution de ses projets. Chaque projet peut contenir plusieurs notes d'avancement (mises à jour régulières datées), qui doivent être sauvegardées de manière persistante sur S3 via Minio.

## Fonctionnalités Principales

### Authentification
- Inscription avec email ou téléphone
- Connexion par email/téléphone + mot de passe
- Validation du mot de passe (min. 6 caractères)
- Confirmation du mot de passe à l'inscription
- Token-based authentication (JWT)
- Stockage sécurisé du token en localStorage
- Déconnexion avec nettoyage des données locales

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
- **✅ Implémenté** : Suppression d'une note
- **❌ Non implémenté** : Modification d'une note existante
- Affichage des notes d'un projet

### Stockage
- Les notes sont stockées dans un bucket S3 sur Minio
- La base de données principale sera MySQL pour les utilisateurs, projets et métadonnées
- Configuration Minio via docker-compose
- Stockage des notes au format JSON dans le bucket

## Livrables Attendus

### Code Source
- Dépôt GitHub/GitLab avec le code complet

### Backend (Node.js, API RESTful)
Base URL: `/api`

#### Endpoints Authentification
- `POST /api/auth/register` → Inscription
  - Body: `{ "email": "string", "phone": "string", "password": "string" }`
  - Response: Message de confirmation
- `POST /api/auth/login` → Connexion
  - Body: `{ "email": "string", "phone": "string", "password": "string" }`
  - Response: `{ "token": "jwt_token" }`
- `GET /api/auth/me` → Récupérer les infos utilisateur
  - Headers: `Authorization: Bearer {token}`

#### Endpoints Projets
- `GET /api/projects` → Récupérer tous les projets de l'utilisateur authentifié
  - Headers: `Authorization: Bearer {token}`
- `POST /api/projects` → Créer un nouveau projet
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ "title": "string", "description": "string" }`
- **❌ Non implémenté** : `PUT /api/projects/:id` → Modifier un projet
- **❌ Non implémenté** : `DELETE /api/projects/:id` → Supprimer un projet

#### Endpoints Notes
- `GET /api/projects/:projectId/notes` → Récupérer les notes d'un projet
  - Headers: `Authorization: Bearer {token}`
- `POST /api/projects/:projectId/notes` → Créer une note pour un projet
  - Headers: `Authorization: Bearer {token}`
  - Body: `{ "title": "string", "description": "string" }`
- **❌ Non implémenté** : `PUT /api/notes/:id` → Modifier une note
- `DELETE /api/notes/:id` → Supprimer une note
  - Headers: `Authorization: Bearer {token}`

### Frontend (React)
- Interface pour créer et afficher les projets
- Interface pour gérer les notes dans chaque projet
- Design simple et intuitif
- Utilisation de composants React pour la modularité

### Base de Données
- **MySQL** : Stockage des utilisateurs, projets et métadonnées
- Gestion via Docker Compose
- Tables : users, projects, notes

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
- ✅ L'application permet aux utilisateurs de s'inscrire et se connecter
- ✅ L'application permet de créer des projets authentifiés
- ✅ L'application permet d'ajouter et supprimer des notes dans les projets
- ⚠️ L'application ne permet pas (encore) de modifier les projets et les notes
- ✅ Les notes sont persistées dans Minio/S3
- ✅ Les utilisateurs et projets sont persistés dans MySQL
- ✅ L'interface est fonctionnelle et responsive
- ✅ Le code est versionné sur Git et containerisé avec Docker

## Procédure de Lancement
- Utiliser `docker-compose up` pour démarrer tous les services (Frontend, Backend, MySQL)
- Consulter le README.md pour les instructions détaillées