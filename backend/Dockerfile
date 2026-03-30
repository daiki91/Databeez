FROM node:20-alpine
WORKDIR /app

# Installer les build tools nécessaires pour compiler les modules natifs
RUN apk add --no-cache python3 make g++ bash

# Copier les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances (ce qui compilera bcrypt, mysql2, etc.)
RUN npm ci

# Copier le reste du code
COPY . ./

EXPOSE 3000

# Lancer le serveur
CMD ["npm", "start"]
