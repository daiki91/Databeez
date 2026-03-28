FROM node:20-alpine
WORKDIR /app

# Installer dépendances de build
RUN apk add --no-cache python3 make g++ bash

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances avec legacy-peer-deps pour React 19 + lucide-react
RUN npm ci --legacy-peer-deps

# Copier le reste du code
COPY . ./

EXPOSE 5173

# Lancer le serveur de dev
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
