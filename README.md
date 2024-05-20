# Mon Projet Node.js

Ce projet utilise Node.js pour la création d'une application web. Vous trouverez ci-dessous les instructions pour l'installation et l'exécution du projet en local, ainsi que les détails de configuration de la base de données.

## Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine :

- Node.js (version 20.11.1)
- npm (gestionnaire de paquets Node.js)
- PHPMyAdmin pour la gestion de la base de données
- node module est déjà installer il n'est pas nécéssaire de le réinstaller avec la commande 'npm install'
## Installation

1. **Cloner le dépôt**

    Clonez ce dépôt sur votre machine locale :
https://github.com/Neron-16/Ecf_1.git

cd votre-repo

Cette commande change le répertoire courant de votre terminal pour celui du projet, ce qui vous permet de travailler avec les fichiers et d'exécuter des commandes spécifiques au projet.
   
Installation des dépendances
 Utilisez npm pour installer les dépendances nécessaires :
npm install
Cela installera toutes les dépendances listées dans le fichier package.json, y compris express.

Configuration de la base de données
Ouvrez PHPMyAdmin.
Créez une nouvelle base de données (si elle n'existe pas déjà).
Importez le fichier de configuration de la base de données depuis le dossier SQL du projet. Vous pouvez le faire en utilisant l'option "Importer" de PHPMyAdmin et en sélectionnant le fichier SQL approprié.
  
Lancer l'application
Pour démarrer l'application, utilisez la commande suivante :
node app.js
L'application sera accessible en local à l'adresse suivante : http://localhost:5500


Détails des outils et technologies
Node.js
Node.js est un environnement d'exécution JavaScript côté serveur. Nous utilisons la version 20 pour ce projet. Vous pouvez télécharger et installer Node.js depuis nodejs.org.

npm
npm est le gestionnaire de paquets pour Node.js. Il est utilisé pour gérer les dépendances du projet. Après avoir installé Node.js, npm sera automatiquement installé.

express
Express est un framework web pour Node.js, utilisé pour construire notre application. Il est inclus dans les dépendances du projet et sera installé avec la commande npm install.

PHPMyAdmin
PHPMyAdmin est un outil de gestion de base de données. Assurez-vous d'avoir une installation locale de PHPMyAdmin configurée pour interagir avec votre base de données MySQL.

Structure du projet
app.js: Le fichier principal de l'application.
views/: Contient les fichiers EJS pour le rendu des pages.
public/: Contient les fichiers statiques (CSS, JS, images).
routes/: Contient les définitions des routes.
SQL/: Contient les fichiers de configuration de la base de données.
Contribuer
Si vous souhaitez contribuer à ce projet, veuillez suivre les étapes suivantes :

Fork le dépôt.
Créez une branche pour votre fonctionnalité (git checkout -b feature/nouvelle-fonctionnalité).
Commitez vos modifications (git commit -am 'Ajout d'une nouvelle fonctionnalité').
Poussez vers la branche (git push origin feature/nouvelle-fonctionnalité).
Ouvrez une Pull Request.
Auteur
Votre Néron-16 - votre-neron.riad@gmail.com

Licence
Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.
Ce README couvre les étapes d'installation, la configuration et l'exécution du projet en local, ainsi que des détails supplémentaires sur les technologies utilisées et la structure du projet. N'oubliez pas de remplacer les informations spécifiques par celles qui correspondent à votre projet.

