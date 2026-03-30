# 🎨 Frontend Databeez

Interface utilisateur React moderne pour la gestion de projets et notes d'avancement.

## 📋 Description

Frontend basé sur **React 19 + Vite** qui fournit une interface intuitive et performante avec :
- Architecture composants React modernes
- Routage avec React Router
- Validation de formulaires avec React Hook Form + Zod
- Gestion d'état avec Context API
- Cache API intelligent avec React Query
- Styling avec TailwindCSS 3
- Animations fluides avec Framer Motion
- Support mode clair/sombre
- Responsive design mobile-first

## 🏗️ Architecture

```
src/
├── main.jsx                # Entry point
├── App.jsx                 # App principal
├── App.css                 # Styles globaux
├── index.css               # Reset CSS
├── components/
│   ├── auth/               # Composants auth
│   ├── common/             # Composants réutilisables (Card, Button, Input, etc.)
│   ├── layout/             # Navbar, Sidebar, Layout
│   ├── notes/              # Composants notes
│   └── projects/           # Composants projets
├── pages/
│   ├── Dashboard.jsx       # Page d'accueil
│   ├── Login.jsx           # Connexion
│   ├── Register.jsx        # Inscription
│   ├── Projects.jsx        # Liste des projets
│   ├── ProjectDetail.jsx   # Détail d'un projet
│   ├── Profile.jsx         # Profil utilisateur
│   └── Toast.jsx           # Notifications
├── contexts/
│   ├── AuthContext.jsx     # Context authentification
│   └── ThemeContext.jsx    # Context thème
├── services/
│   ├── api.js              # Client API Axios
│   ├── authService.js      # Services auth
│   └── projectService.js   # Services projets
├── hooks/
│   └── index.js            # Custom hooks
├── utils/
│   ├── dateUtils.js        # Utilitaires dates
│   └── schemas.js          # Schémas Zod
└── styles/
    └── index.css           # Styles additionnels

public/
└── ...                     # Assets statiques
```

## 🔧 Installation Locale

```bash
# Installer les dépendances
npm install

# OU avec legacy-peer-deps (React 19 + lucide-react)
npm install --legacy-peer-deps

# Lancer le serveur dev (Vite)
npm run dev

# Construire pour production
npm run build

# Linter le code
npm run lint
```

## 🐳 Docker

```bash
# Construire l'image
docker build -t databeez-frontend .

# Lancer le conteneur
docker run -p 5173:5173 databeez-frontend
```

## 📝 Variables d'Environnement

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Databeez
```

## 🎯 Pages et Routes

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | Login | Page de connexion |
| `/register` | Register | Page d'inscription |
| `/dashboard` | Dashboard | Aperçu principal |
| `/projects` | Projects | Liste des projets |
| `/projects/:id` | ProjectDetail | Détail d'un projet |
| `/profile` | Profile | Profil utilisateur |

## 🎨 Thème et Styling

**TailwindCSS 3.3.6** avec configuration personnalisée :

```js
// Couleurs principales
primary: Mauve (#7c3aed)
secondary: Bleu Ciel (#0ea5e9)
accent: Rouge (#ef4444)

// Breakpoints
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

**Modes de thème :**
- 🌓 Auto (détect. OS)
- ☀️ Clair
- 🌙 Sombre

Persistance en `localStorage`

## ✅ Dépendances Principales

```json
{
  "react": "19.2.4",
  "react-router-dom": "6.20.0",
  "@tanstack/react-query": "5.28.0",
  "react-hook-form": "7.48.0",
  "zod": "3.22.4",
  "framer-motion": "10.16.4",
  "lucide-react": "0.408.0",
  "sonner": "1.3.0",
  "axios": "1.6.0",
  "date-fns": "2.30.0"
}
```

## 🎯 Développement

```bash
# Lancer en mode dev
npm run dev

# Linter le code
npm run lint

# Construire pour prod
npm run build

# Prévisualiser la build prod
npm run preview
```

## 🔒 Authentification

- JWT tokens stockés en `localStorage`
- Tokens envoyés dans `Authorization: Bearer {token}`
- Expiration 8h (côté backend)
- Logout efface le token

## 📱 Responsive Design

L'interface s'adapte automatiquement selon l'écran :

- 📱 **Mobile** (< 640px) - 1 colonne
- 📱 **Tablette** (640-1024px) - 2 colonnes
- 💻 **Desktop** (1024-1280px) - 3 colonnes
- 🖥️ **Grand écran** (> 1280px) - 4 colonnes

## 🚀 Performance

- **Vite** : Build ultra-rapide (< 1s)
- **React Query** : Cache intelligent, requêtes smart
- **Code Splitting** : Chargement à la demande
- **Lazy Loading** : Images et composants
- **Tree Shaking** : Élimination code inutilisé

## 📞 Support

Développé par **daiki91**
