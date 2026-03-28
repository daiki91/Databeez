# 🧪 Guide de Test Complet - Databeez

Ce guide teste l'intégration complète: **Frontend → Backend → MySQL → Minio**

## ✅ Statut des Services

Vérifiez que tous les conteneurs sont en cours d'exécution:

```bash
docker-compose ps
```

Vous devez voir:
- ✅ **databeez-frontend** (5173) - React App
- ✅ **databeez-backend** (3000) - API Node.js
- ✅ **databeez-mysql** (3306) - Base de données
- ✅ **databeez-phpmyadmin** (8080) - Gestion MySQL
- ✅ **minio** (9000) - Stockage S3

---

## 🧪 Scénario de Test Complet

### Étape 1: Vérifier que l'API est en ligne
```
GET http://localhost:3000/
```

Réponse attendue: Liste complète des endpoints disponibles ✅

---

### Étape 2: Inscription d'un nouvel utilisateur

**URL Frontend**: http://localhost:5173/register

**Données de test:**
```json
{
  "email": "test@example.com",
  "phone": "",
  "password": "password123"
}
```

**Comportement attendu:**
1. ✅ Validation du formulaire (6 caractères min pour le mot de passe)
2. ✅ Toast "Inscription réussie !"
3. ✅ Redirection automatique au dashboard
4. ✅ Token JWT sauvegardé en localStorage

**Vérification en Base de Données:**
```
URL: http://localhost:8080/index.php?route=/database/structure&db=databeez&table=users
Vous devez voir l'utilisateur créé avec email: test@example.com
```

---

### Étape 3: Créer un Projet

**URL Frontend**: http://localhost:5173/projects

**Données de test:**
```json
{
  "title": "Mon Premier Projet",
  "description": "Ceci est un projet de test"
}
```

**Comportement attendu:**
1. ✅ Formulaire visible avec champs "titre" et "description"
2. ✅ Bouton "Créer" fonctionne
3. ✅ Toast "Projet créé !"
4. ✅ Projet apparaît dans la liste

**Vérification en Base de Données:**
```
URL: http://localhost:8080/index.php?route=/database/structure&db=databeez&table=projects
Vous devez voir: 
- title: "Mon Premier Projet"
- description: "Ceci est un projet de test"
```

---

### Étape 4: Ajouter une Note au Projet

**URL Frontend**: http://localhost:5173/projects/{projectId}

**Données de test:**
```json
{
  "title": "Note Avancement - Day 1",
  "description": "Configuration initiale terminée, frontend modernisé"
}
```

**Comportement attendu:**
1. ✅ Page de détail du projet s'affiche
2. ✅ Formulaire "Ajouter une note" visible
3. ✅ Toast "Note créée !"
4. ✅ Note apparaît dans l'historique chronologique

**Vérification en Base de Données:**
```
URL: http://localhost:8080/index.php?route=/database/structure&db=databeez&table=notes
Vous devez voir:
- project_id: {id du projet créé}
- title: "Note Avancement - Day 1"
- description: "Configuration initiale terminée..."
```

---

### Étape 5: Vérifier le Stockage Minio (S3)

**URL Minio**: http://localhost:9000

**Identifiants:**
```
Access Key: admin
Secret Key: passer123
```

**Comportement attendu:**
1. ✅ Connectez-vous avec les identifiants ci-dessus
2. ✅ Naviguez vers le bucket: **databeez-notes**
3. ✅ Vous devez voir: `notes/{noteId}.json`

**Vérification du contenu:**
```json
{
  "id": 1,
  "project_id": 1,
  "title": "Note Avancement - Day 1",
  "description": "Configuration initiale terminée...",
  "created_at": "2026-03-28T20:50:00.000Z"
}
```

---

### Étape 6: Tester la Suppression d'une Note

**Comportement attendu:**
1. ✅ Cliquez sur l'icône poubelle sur une note
2. ✅ Toast "Note supprimée !"
3. ✅ Note disparaît de la liste
4. ✅ Fichier Minio `notes/{noteId}.json` est supprimé

---

### Étape 7: Tester la Suppression d'un Projet

**Comportement attendu:**
1. ✅ Cliquez sur bouton supprimer du projet
2. ✅ Toast "Projet supprimé !"
3. ✅ Projet disparaît de la liste
4. ✅ Tous les notes associated sont supprimées (CASCADE)

---

### Étape 8: Tester la Déconnexion et Reconnexion

**Comportement attendu:**
1. ✅ Cliquez sur "Déconnexion" dans le navbar
2. ✅ Token supprimé de localStorage
3. ✅ Redirection vers la page de connexion
4. ✅ Essayez d'accéder `/dashboard` manuellement → Redirection vers login

---

## 🔧 Vérification des Logs

### Logs Backend
```bash
docker-compose logs -f backend
```

Vous devez voir:
```
Base de données initialisée
Bucket databeez-notes créé
Serveur lancé sur port 3000
```

### Logs Frontend
```bash
docker-compose logs -f frontend
```

Vous devez voir:
```
VITE v8.0.3  ready in ... ms
➜  Local:   http://localhost:5173/
```

### Logs MySQL
```bash
docker-compose logs -f mysql
```

---

## 📊 Checklist d'Intégration Complète

- [ ] **Frontend s'affiche** correctement sur http://localhost:5173
- [ ] **Inscription** crée un utilisateur en MySQL
- [ ] **Token JWT** est retourné et sauvegardé
- [ ] **Login** valide le token et redirige au dashboard
- [ ] **Dashboard** affiche les statistiques
- [ ] **Créer un projet** l'ajoute à MySQL
- [ ] **Ajouter une note** la sauvegarde en MySQL ET Minio
- [ ] **Supprimer une note** la supprime des deux (MySQL + Minio)
- [ ] **Supprimer un projet** supprime les notes associées (CASCADE)
- [ ] **PhpMyAdmin** affiche les données correctes
- [ ] **Minio Console** affiche les fichiers JSON des notes
- [ ] **Themes clair/sombre** fonctionne
- [ ] **Responsive design** sur mobile/tablet/desktop

---

## 🐛 Troubleshooting

### Erreur: "Cannot POST /api/auth/register"
→ Assurez-vous que le backend est en cours d'exécution (port 3000)
```bash
docker-compose restart backend
```

### Erreur: "Token invalide"
→ Le token a expiré (8h) ou le JWT_SECRET est différent
→ Reconnectez-vous

### Base de données vide
→ Vérifiez que MySQL est connecté et les tables sont créées
→ Allez sur http://localhost:8080 pour vérifier

### Minio ne sauvegarde pas les notes
→ Vérifiez que Minio est en cours d'exécution
→ Vérifiez les credentials (admin/passer123)
→ Vérifiez le nom du bucket (databeez-notes)

---

## 📞 Support

Si vous rencontrez des problèmes:

1. **Vérifiez les logs**: `docker-compose logs -f`
2. **Relancez les services**: `docker-compose down && docker-compose up --build`
3. **Nettoyez les volumes**: `docker-compose down -v`
4. **Inspectez la base**: http://localhost:8080
5. **Inspectez Minio**: http://localhost:9000
