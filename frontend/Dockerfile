# ----------------------------------------------------------------------
# Étape 1 : Construction (Build) de l'application React
# ----------------------------------------------------------------------
# Utilise Node.js 20 sur Alpine pour une image légère.
FROM node:20-alpine AS build

# Définir l'argument de construction pour l'URL de l'API (e.g., /api)
ARG REACT_APP_API_URL

WORKDIR /app

# 1. Installer les dépendances
# Copier package.json et package-lock.json pour un meilleur cache Docker.
COPY package*.json ./

# Installer les dépendances basées sur le lock file.
# Note: npm ci est rapide et précis.
RUN npm install

# 2. Copier tout le code source
COPY . .

# 3. Injecter les variables d'environnement au moment du build
# La variable REACT_APP_API_URL est injectée lors de la commande 'npm run build'.
# Nous utilisons la syntaxe React standard pour l'injecter.
# IMPORTANT: Assurez-vous que votre script 'build' utilise les variables NODE_ENV=production et REACT_APP_...
RUN REACT_APP_API_URL=${REACT_APP_API_URL} npm run build

# ----------------------------------------------------------------------
# Étape 2 : Production (Servir avec Nginx)
# ----------------------------------------------------------------------
# Utilise l'image Nginx Alpine (très légère et optimisée pour servir des fichiers statiques).
FROM nginx:alpine

# Copier la configuration Nginx personnalisée (doit exister dans le contexte)
# Ceci est crucial pour le routage Ingress (/api) et la gestion des Single Page Applications (try_files).
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis l'étape 'build'
# Le répertoire 'build' est l'artefact créé par 'npm run build'.
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port par défaut de Nginx
EXPOSE 80

# Commande de démarrage Nginx (maintenue)
CMD ["nginx", "-g", "daemon off;"]