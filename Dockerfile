# Étape de build
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour npm install
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste des fichiers du projet
COPY . .

# Build de l'application en mode production
RUN npm run build -- --configuration=production

# Étape de production
FROM node:20-alpine AS production

# Installer serve globalement
RUN npm install -g serve@14.2.1

# Créer un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de build
COPY --from=builder --chown=appuser:appgroup /app/dist/music-stream/browser ./dist

# Utiliser l'utilisateur non-root
USER appuser

# Exposer le port
EXPOSE 4200

# Commande pour démarrer l'application
CMD ["serve", "-s", "dist", "-l", "4200"] 