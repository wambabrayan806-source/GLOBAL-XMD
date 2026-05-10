#!/usr/bin/bash

# Mise à jour des dépôts
echo "Mise à jour des paquets en cours..."
pkg update && pkg upgrade -y

# Installation des dépendances pour KING-DYLAN-MD
echo "Installation des outils système (FFmpeg, ImageMagick, Node.js)..."
pkg install -y git nodejs ffmpeg imagemagick webp yarn

# Installation des modules Node.js
echo "Installation des dépendances du bot..."
yarn install || npm install

# Nettoyage
echo "Nettoyage des fichiers temporaires..."
rm -rf ~/.cache

echo "-------------------------------------------------------"
echo "Installation terminée avec succès, King Dylan !"
echo "Pour lancer ton bot, utilise la commande : npm start"
echo "-------------------------------------------------------"

npm start
