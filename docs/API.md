# 📚 API Documentation - Databeez

Base URL: `http://localhost:3000/api`

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "+33612345678",  // Optional if email provided
  "password": "password123"
}

Response 201:
{
  "message": "Inscription réussie",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "phone": null
  }
}

Response 400:
{
  "message": "Email déjà utilisé"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "+33612345678",  // Optional if email provided
  "password": "password123"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}

Response 401:
{
  "message": "Email ou mot de passe incorrects"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "email": "user@example.com",
  "phone": null,
  "created_at": "2024-03-30T10:30:00Z"
}

Response 401:
{
  "message": "Token invalide ou expiré"
}
```

## 📁 Projects

### List Projects
```http
GET /projects
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Mon Projet",
    "description": "Description du projet",
    "created_at": "2024-03-30T10:30:00Z",
    "updated_at": "2024-03-30T10:30:00Z",
    "notesCount": 5
  },
  {
    "id": 2,
    "user_id": 1,
    "title": "Autre Projet",
    "description": null,
    "created_at": "2024-03-29T15:45:00Z",
    "updated_at": "2024-03-29T15:45:00Z",
    "notesCount": 0
  }
]
```

### Create Project
```http
POST /projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nouveau Projet",
  "description": "Description optionnelle du projet"
}

Response 201:
{
  "id": 3,
  "user_id": 1,
  "title": "Nouveau Projet",
  "description": "Description optionnelle du projet",
  "created_at": "2024-03-30T11:20:00Z",
  "updated_at": "2024-03-30T11:20:00Z"
}

Response 400:
{
  "message": "Titre du projet requis"
}
```

### Get Project by ID
```http
GET /projects/:id
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "user_id": 1,
  "title": "Mon Projet",
  "description": "Description du projet",
  "created_at": "2024-03-30T10:30:00Z",
  "updated_at": "2024-03-30T10:30:00Z"
}

Response 404:
{
  "message": "Projet non trouvé"
}
```

### Delete Project
```http
DELETE /projects/:id
Authorization: Bearer {token}

Response 200:
{
  "message": "Projet supprimé avec succès"
}

Response 404:
{
  "message": "Projet non trouvé"
}

Note: Les notes du projet sont supprimées en cascade
```

## 📝 Notes

### List Notes by Project
```http
GET /projects/:projectId/notes
Authorization: Bearer {token}

Response 200:
[
  {
    "id": 1,
    "project_id": 1,
    "title": "Note 1",
    "description": "Contenu de la note de jour 1",
    "created_at": "2024-03-30T10:35:00Z",
    "updated_at": "2024-03-30T10:35:00Z"
  },
  {
    "id": 2,
    "project_id": 1,
    "title": "Note 2",
    "description": "Contenu de la note de jour 2",
    "created_at": "2024-03-29T16:00:00Z",
    "updated_at": "2024-03-29T16:00:00Z"
  }
]
```

### Create Note
```http
POST /projects/:projectId/notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nouvelle Note",
  "description": "Contenu détaillé de la note"
}

Response 201:
{
  "id": 3,
  "project_id": 1,
  "title": "Nouvelle Note",
  "description": "Contenu détaillé de la note",
  "created_at": "2024-03-30T11:25:00Z",
  "updated_at": "2024-03-30T11:25:00Z"
}

Response 400:
{
  "message": "Titre de la note requis"
}

Response 404:
{
  "message": "Projet non trouvé"
}

Note: Le contenu JSON est stocké dans Minio S3 (databeez-notes bucket)
```

### Get Note by ID
```http
GET /projects/:projectId/notes/:noteId
Authorization: Bearer {token}

Response 200:
{
  "id": 1,
  "project_id": 1,
  "title": "Note 1",
  "description": "Contenu complet de la note",
  "created_at": "2024-03-30T10:35:00Z",
  "updated_at": "2024-03-30T10:35:00Z"
}

Response 404:
{
  "message": "Note non trouvée"
}
```

### Delete Note
```http
DELETE /notes/:id
Authorization: Bearer {token}

Response 200:
{
  "message": "Note supprimée avec succès"
}

Response 404:
{
  "message": "Note non trouvée"
}

Note: Supprime aussi les fichiers S3 dans Minio
```

## 🔧 Error Handling

### Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Token manquant/invalide |
| 403 | Forbidden | Accès refusé |
| 404 | Not Found | Ressource inexistante |
| 500 | Server Error | Erreur serveur |

### Error Response Format
```json
{
  "message": "Description de l'erreur",
  "code": "ERROR_CODE"
}
```

## 📊 Authentication Headers

Tous les endpoints protégés requièrent:

```http
Authorization: Bearer {token}
```

Le token est un JWT valide pendant **8 heures**.

### Décodage du Token
```javascript
// Exemple: Décoder le token côté client
const token = localStorage.getItem('token');
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log(decoded.userId);  // ID utilisateur
console.log(decoded.exp);      // Expiration (timestamp Unix)
```

## 🎯 Exemples cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon Projet",
    "description": "Description"
  }'
```

### List Projects
```bash
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Note
```bash
curl -X POST http://localhost:3000/api/projects/1/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Note du jour",
    "description": "Contenu"
  }'
```

### Delete Project
```bash
curl -X DELETE http://localhost:3000/api/projects/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔄 Rate Limiting

**Non implémenté** - À ajouter pour production

## 📝 Versioning

API actuellement en **v1** implicite.

Futures versions devraient suivre: `/api/v2/projects`

## 🧪 Testing avec Postman

1. Créer collection "Databeez"
2. Créer environment avec:
   - `base_url` = `http://localhost:3000/api`
   - `token` = (valeur vide, remplie après login)
3. Tests:
   - POST register → sauvegarder token
   - GET projects avec token
   - POST project
   - GET project/:id
   - etc.

## 📞 Support & Issues

- Erreurs de validation: Vérifier les types de données
- 401 Unauthorized: Vérifier token en localStorage
- 404 Not Found: Vérifier l'ID de la ressource
- 500 Server Error: Vérifier les logs backend

---

**API Databeez v1.0** | Documenté par daiki91
