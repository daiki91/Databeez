# 📊 Databeez - Frontend Modernisé

Interface React moderne et élégante pour l'application de gestion de projets **Databeez**.

## ✨ Caractéristiques

- **Design épuré** avec Tailwind CSS
- **Thème clair/sombre** intégré
- **Responsive** sur tous les appareils
- **Animations fluides** avec Framer Motion
- **Gestion d'état** avec React Query
- **Validation de formulaires** avec React Hook Form + Zod
- **Authentification JWT** sécurisée
- **Notifications toast** avec Sonner
- **Accessibilité WCAG 2.1 AA**

## 🚀 Installation rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer les variables d'environnement

Copier `.env.example` vers `.env.local` :

```bash
cp .env.example .env.local
```

Edit `.env.local` si nécessaire (les valeurs par défaut devraient fonctionner en local)

### 3. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

## 📦 Scripts disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Générer la version production
- `npm run preview` - Prévisualiser la build production
- `npm run lint` - Vérifier le code avec ESLint

## 🏗️ Structure des fichiers

```
src/
├── components/         # Composants réutilisables
│   ├── common/        # Button, Card, Input, Modal, etc.
│   ├── layout/        # Layout, Navbar, Sidebar
│   ├── projects/      # Composants pour les projets
│   ├── notes/         # Composants pour les notes
│   └── auth/          # Composants d'authentification
├── pages/             # Pages principales
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Projects.jsx
│   └── ProjectDetail.jsx
├── contexts/          # Context API
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── services/          # Appels API
│   ├── api.js
│   ├── authService.js
│   └── projectService.js
├── hooks/             # Hooks personnalisés
├── utils/             # Utilitaires
│   ├── schemas.js     # Schémas Zod
│   └── dateUtils.js   # Gestion des dates
├── styles/            # Styles CSS
│   └── index.css      # Tailwind et styles globaux
└── App.jsx            # Routeur principal
```

## 🎨 Personnalisation

### Thème et couleurs

Modifiez `tailwind.config.js` pour personnaliser :
- Les couleurs primaires, secondaires, accent
- Les typographies
- Les animations
- Les espacements

### Palette de couleurs par défaut

- **Primary** : Violet (indigo)
- **Secondary** : Bleu ciel (sky)
- **Accent** : Rouge (rose)

## 🔐 Authentification

L'application utilise JWT pour l'authentification :

1. **Inscription** : Email/Téléphone + mot de passe (6+ caractères)
2. **Connexion** : Email/Téléphone + mot de passe
3. **Token** : Stocké dans localStorage
4. **Expiration** : Redirection automatique vers login si token expiré

## 📱 Responsive Design

- **Mobile** : < 640px (une colonne)
- **Tablette** : 640px - 1024px (deux colonnes)
- **Desktop** : > 1024px (trois colonnes)

## 🎯 Pages principales

### 📝 Authentification (`/` et `/register`)
- Formulaires stylisés
- Validation en temps réel
- Toggle email/téléphone
- Affichage/masquage du mot de passe

### 📊 Tableau de bord (`/dashboard`)
- Vue d'ensemble statistiques
- Projets récents
- Message de bienvenue personnalisé
- Accès rapide aux projets

### 📁 Projets (`/projects`)
- Grille de projets responsive
- Recherche en temps réel
- Tri (récent, alphabétique)
- Modal de création
- Badges de statut

### 📄 Détail du projet (`/projects/:id`)
- Informations du projet
- Historique des notes chronologique
- Formulaire d'ajout de note
- Suppression de notes avec confirmation
- Timeline élégante

## 🎭 Composants réutilisables

### Button
```jsx
<Button variant="primary" size="md" isLoading={false}>
  Cliquez-moi
</Button>
```

### Card
```jsx
<Card>
  <CardHeader>Titre</CardHeader>
  <CardBody>Contenu</CardBody>
  <CardFooter>Pied de page</CardFooter>
</Card>
```

### Input
```jsx
<Input
  label="Email"
  placeholder="email@example.com"
  error={errors.email}
  {...register('email')}
/>
```

### Modal
```jsx
<Modal isOpen={true} onClose={handleClose} title="Titre">
  Contenu du modal
</Modal>
```

### Badge
```jsx
<Badge variant="primary" size="md">
  5 notes
</Badge>
```

## 🔄 Gestion d'état

### React Query (TanStack Query)
- Automatisation des appels API
- Mise en cache intelligente
- Invalidation intelligente
- Retry automatique

### Context API
- **AuthContext** : Authentification et informations utilisateur
- **ThemeContext** : Gestion du thème clair/sombre

## 🎬 Animations

Toutes les animations utilisent **Framer Motion** :
- Transitions de page (fade, slide)
- Hover effects
- Apparition progressive
- Modale animée

## 📊 Gestion des formulaires

Utilisation de **React Hook Form** + **Zod** pour :
- Validation en temps réel
- Messages d'erreur dynamiques
- Préremplissage
- Focus automatique

## 🔗 Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|------------------|
| `VITE_API_URL` | URL de l'API | `http://localhost:3000/api` |

## 🐛 Dépannage

### Le CSS n'est pas chargé
- Vérifiez que `postcss` et `autoprefixer` sont installés
- Redémarrez le serveur de développement

### Les icônes ne s'affichent pas
- Vérifiez que `lucide-react` est installé
- Vérifiez les imports

### L'authentification ne fonctionne pas
- Vérifiez que l'API backend est démarrée
- Vérifiez la valeur de `VITE_API_URL`
- Ouvrez la console pour voir les erreurs réseau

## 📚 Dépendances principales

- **react** 19.2.4 - Framework UI
- **react-router-dom** 6.20 - Routage
- **tailwindcss** 3.3.6 - Styling
- **@tanstack/react-query** 5.28 - Gestion API
- **react-hook-form** 7.48 - Gestion formulaires
- **zod** 3.22 - Validation
- **framer-motion** 10.16 - Animations
- **lucide-react** 0.294 - Icônes
- **sonner** 1.3 - Notifications
- **date-fns** 2.30 - Dates

## 📖 Documentation

- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [React Query](https://tanstack.com/query)
- [Framer Motion](https://www.framer.com/motion)
- [Lucide Icons](https://lucide.dev)

## 🚀 Production

Générer la version production :

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`

## 📝 License

Propriété de Databeez - Tous droits réservés

## 💡 Prochaines améliorations

- [ ] Mode hors ligne
- [ ] Export PDF des notes
- [ ] Collaboration en temps réel
- [ ] Gestion des fichiers
- [ ] Intégration d'une API d'IA pour les suggestions
- [ ] Tests automatisés
- [ ] Documentation interactive avec Storybook
