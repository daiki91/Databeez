# 📋 Système d'Audit et d'Historique - DataBeez

> Suivi complet des modifications avec identification de l'auteur et des changements

## 🎯 Vue d'ensemble

Le système d'audit enregistre **qui a fait quoi** et **quand** sur chaque projet et note. Chaque action (création, modification, suppression) est enregistrée avec :

- ✅ **Auteur** : Email ou téléphone de l'utilisateur
- ✅ **Action** : CREATE / UPDATE / DELETE
- ✅ **Timestamp** : Date et heure exacte
- ✅ **Changements** : Anciennes et nouvelles valeurs (pour UPDATE/DELETE)

---

## 🏗️ Architecture

### Base de Données

#### 1. Colonnes des tables `projects` et `notes`
```sql
created_by INT NOT NULL      -- ID utilisateur qui a créé
updated_by INT               -- ID utilisateur qui a modifié (NULL si jamais modifié)
created_at DATETIME          -- Date/heure creation
updated_at DATETIME          -- Date/heure dernière modification
```

#### 2. Table `audit_logs` (historique)
```sql
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(50),      -- "project" ou "note"
  entity_id INT,               -- ID du projet/note modifié(e)
  action VARCHAR(20),          -- "CREATE", "UPDATE", "DELETE"
  user_id INT,                 -- ID utilisateur auteur
  old_values JSON,             -- Anciennes valeurs avant modif
  new_values JSON,             -- Nouvelles valeurs après modif
  action_date DATETIME,        -- Quand l'action s'est produite
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔧 Endpoints API

### Historique d'un Projet
```bash
GET /api/projects/:projectId/history
```

**Réponse :**
```json
[
  {
    "id": 1,
    "entity_type": "project",
    "entity_id": 5,
    "action": "CREATE",
    "user_id": 1,
    "user_email": "alice@example.com",
    "user_phone": null,
    "old_values": null,
    "new_values": {
      "title": "Mon Projet",
      "description": "Description du projet"
    },
    "action_date": "2026-03-29 10:30:00"
  },
  {
    "id": 2,
    "entity_type": "project",
    "entity_id": 5,
    "action": "UPDATE",
    "user_id": 2,
    "user_email": "bob@example.com",
    "user_phone": null,
    "old_values": {
      "title": "Mon Projet",
      "description": "Description du projet"
    },
    "new_values": {
      "title": "Mon Projet Modifié",
      "description": "Nouvelle description"
    },
    "action_date": "2026-03-29 11:45:00"
  }
]
```

### Historique d'une Note
```bash
GET /api/notes/:noteId/history
```

Même format que pour les projets, mais avec `entity_type: "note"`

### Historique Général
```bash
GET /api/history?entityType=project&entityId=5&limit=50&offset=0
```

**Paramètres :**
- `entityType` : "project" ou "note" (optionnel)
- `entityId` : ID de l'entité (optionnel)
- `limit` : Nombre d'entrées (défaut: 50)
- `offset` : Décalage pour pagination (défaut: 0)

---

## 🎨 Interface Frontend

### Page ProjectDetail - Onglet "Historique"
L'historique s'affiche sur la page `/projects/:id` avec un onglet dédié.

**Affichage pour chaque modification :**
1. 🔵 Icône (création/modification/suppression)
2. **Action** : "Créé", "Modifié", "Supprimé"
3. **Auteur** : "par alice@example.com"
4. **Date/heure** : Formatée lisiblement
5. **Changements** (détail) :
   - ✏️ **UPDATE** : "ancienne valeur → nouvelle valeur"
   - ➕ **CREATE** : "valeurs créées"
   - ❌ **DELETE** : "valeurs supprimées"

### Composant History
```javascript
import { History } from '@/components/common/History';

<History 
  entityType="project"  // "project" ou "note"
  entityId={projectId}  
  title="Historique du projet"
/>
```

---

## 📊 Cas d'Usage

### 1️⃣ Créer un Projet
```
Action: CREATE
Auteur: alice@example.com
old_values: null
new_values: { title: "Nouveau Projet", description: "..." }
```

### 2️⃣ Modifier un Projet
```
Action: UPDATE
Auteur: bob@example.com
old_values: { title: "Nouveau Projet", description: "Ancienne desc" }
new_values: { title: "Nouveau Projet", description: "Nouvelle desc" }
```

### 3️⃣ Supprimer une Note
```
Action: DELETE
Auteur: charlie@example.com
old_values: { title: "Ma Note", description: "Contenu" }
new_values: null
```

---

## 🔐 Sécurité & Permissions

✅ **Protégé par JWT** : Seuls les utilisateurs authentifiés peuvent voir l'historique
✅ **Traçabilité complète** : Impossible de masquer qui a modifié quoi
✅ **Immutable** : Une fois enregistré, l'historique ne peut pas être effacé (même au DELETE)

---

## ⚠️ Notes Importantes

### 1. Données Antérieures
Les projets/notes créés **avant** l'implémentation du système d'audit n'auront **pas** de `created_by`. 

**Solution :** Faire une migration :
```sql
UPDATE projects SET created_by = 1 WHERE created_by IS NULL;
```

### 2. Performance
La table `audit_logs` peut devenir volumineuse. À surveiller :
```sql
-- Compter les entrées
SELECT COUNT(*) FROM audit_logs;

-- Archiver les anciennes entrées (> 6 mois)
DELETE FROM audit_logs WHERE action_date < DATE_SUB(NOW(), INTERVAL 6 MONTH);
```

### 3. Structure JSON dans old_values / new_values
Les valeurs sont stockées en JSON pour flexibilité future :
```json
{
  "title": "Mon Projet",
  "description": "Description",
  "status": "in_progress"  // Si ajouté plus tard
}
```

---

## 📈 Futures Améliorations

- 📊 Dashboard analytique : "Qui est le plus actif cette semaine?"
- 🔔 Notifications : "Le projet X a été modifié par..."
- 📥 Export CSV : "Télécharger l'historique en CSV"
- 🔙 Rollback : "Annuler la dernière modification"
- 🏷️ Tags : "Cette modification est liée au bug #123"

---

## 🧪 Test de l'API

### Avec curl
```bash
# Historique d'un projet
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/projects/1/history

# Historique général
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/history?entityType=project&limit=10"
```

### Avec Postman
1. Ajouter la variable: `{{token}}` en Bearer Token
2. GET `{{baseURL}}/projects/{{projectId}}/history`
3. Vérifier la réponse JSON

---

## 🎓 Exemples Concrets

### Exemple 1 : Suivre les modifications d'un projet
```
1. 10:30 - Alice crée "Q2 Campaign"
2. 11:00 - Bob modifie la description
3. 14:30 - Charlie ajoute des notes
4. 16:00 - Alice supprime accidentellement, puis..
5. 16:05 - Bob restaure le projet (créé une nouvelle version)
```
**Résultat:** Historique complet visible pour la traçabilité

### Exemple 2 : Audit de conformité
Manager peut voir :
- ✅ Qui a créé chaque note
- ✅ Quand elle a été créée
- ✅ Qui l'a modifiée et comment
- ✅ Qui l'a supprimée

**Parfait pour:** Audits, compliance, responsabilité

---

## 🔗 Fichiers Modifiés

- ✅ `sqlScrip.sql` - Tables audit et colonnes `created_by`/`updated_by`
- ✅ `server.js` - Endpoints historique + fonction `logAudit()`
- ✅ `gestion/src/components/common/History.jsx` - Composant affichage
- ✅ `gestion/src/pages/ProjectDetail.jsx` - Intégration onglet historique

---

**Implémentation complète du système d'audit! 🎉**
