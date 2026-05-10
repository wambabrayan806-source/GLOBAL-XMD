# Utilisation de l'image de base qui contient déjà les outils nécessaires
FROM quay.io/qasimtech/global-botz:latest

# On définit le dossier de travail
WORKDIR /root/king-dylan

# On copie TOUS les fichiers de ton dépôt actuel dans le conteneur
COPY . .

# On installe les dépendances (npm ou yarn)
RUN npm install || yarn install

# Port de communication (souvent utilisé pour garder le bot en vie)
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]
