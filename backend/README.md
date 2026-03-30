# 🚀 Backend Databeez

API RESTful pour la gestion de projets et notes d'avancement.

## 📋 Description

Backend basé sur **Node.js + Express** qui fournit une API sécurisée avec :
- Authentification JWT
- Gestion des utilisateurs (email/téléphone)
- CRUD des projets et notes
- Stockage S3 (Minio) pour les fichiers
- Base de données MySQL

## 🏗️ Architecture

```
src/
├── server.js          # Serveur principal
├── routes/            # Endpoints API
├── middleware/        # Auth, validation, etc.
├── controllers/       # Logique métier
├── models/            # Schémas DB
└── utils/             # Helpers, config
```

## 🔧 Installation Locale

```bash
# Installer les dépendances
npm install

# Lancer en développement (avec nodemon)
npm run dev

# Lancer en production
npm start
```

## 🐳 Docker

```bash
# Construire l'image
docker build -t databeez-backend .

# Lancer le conteneur
docker run -p 3000:3000 databeez-backend
```

## 📝 Variables d'Environnement

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=databeez

MINIO_ENDPOINT_HOST=localhost
MINIO_ENDPOINT_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

JWT_SECRET=your-secret-key
PORT=3000
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Infos utilisateur (protégé)

### Projects
- `GET /api/projects` - Lister les projets (protégé)
- `POST /api/projects` - Créer un projet (protégé)
- `DELETE /api/projects/:id` - Supprimer un projet

### Notes
- `GET /api/projects/:projectId/notes` - Lister les notes
- `POST /api/projects/:projectId/notes` - Créer une note
- `DELETE /api/notes/:id` - Supprimer une note

## ✅ Dépendances

- **express** - Framework web
- **mysql2** - Client MySQL
- **bcrypt** - Hashage des mots de passe
- **jsonwebtoken** - Authentification JWT
- **minio** - Client S3
- **dotenv** - Variables d'environnement
- **cors** - CORS middleware
- **nodemon** - Reload automatique (dev)

## 📚 Développement

```bash
# Installer une nouvelle dépendance
npm install package-name

# Installer une dépendance de développement
npm install --save-dev package-name

# Lancer les tests
npm test
```

## 🔐 Sécurité

- JWT tokens avec expiration 8h
- Mots de passe hashés avec bcrypt
- CORS configuré
- Validation des entrées
- SQL injection protection (prepared statements)

## 📞 Support

Développé par **daiki91**
