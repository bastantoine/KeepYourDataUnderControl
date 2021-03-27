# Service de stockage

Cette application web est conçue pour permettre de tester l'implémentation des principes proposés au sein de l'extension. Elle est constituée d'un service tournant avec Flask sous Python et d'une base MongoDB.

# Installation

Deux méthodes sont possibles pour installer et faire fonctionner cette application : en utilisant Docker et le fichier `docker-compose.yml` fourni ou à la main.

## Configuration préalable de l'API

L'API doit être configurés au préalable afin de pouvoir fonctionner correctement. Pour ce faire, elle utilise un fichier `.env` contenant une liste de variables d'environnement.

Pour les configurer correctement, il suffit de dupliquer le fichier `.env.sample` en le renommant `.env` et modifier si nécessaire les valeurs présentes.

Variable | Valeur par défaut | Description
---------|-------------------|------------
`API_ENDPOINT` | `http://localhost:5000` | URL de l'API
`API_UPLOAD_FOLDER` | `upload_files` | Le dossier à utiliser pour stocker les fichiers envoyés au service. Doit être un chemin vers un dossier, soit absolu, soit relatif à `demo-storage`. À noter que le dossier est créé automatique au lancement de l'application s'il n'existe pas déjà.
`BASE_URL` | `http://localhost:8000` | L'url de base à utiliser pour construire les url complètes permettant d'accéder aux fichiers stockés
`API_ROOT_FOLDER` | `/usr/src/app` | Dossier utilisé pour stocker les fichiers de l'application dans le conteneur. Spécifique à Docker, ne sert pas autrement.
`MONGO_URL` | `mongodb://root:example@mongo-db:27017` | URL de connexion à la base MongoDB. Ce lien doit inclure le nom d'utilisateur et le mot de passe suivant ce schéma : `mongodb://<user>:<passwd>@<host>[:<port>`
`MONGO_DB_NAME` | `files_db` | Le nom de la base MongoDB à utiliser
`MONGO_FILES_COLLECTION_NAME` | `files` | Le nom de la collections MongoDB à utiliser

**Note pour l'utilisation de Docker et docker-compose**

Dans le cas de l'utilisation du fichier `docker-compose.yml` pour le déploiement de l'application, le nom d'utilisateur et le mot de passe utilisés pour se connecter à la base sont déjà configuré lors de la création du conteneur MongoDB, ainsi il est conseillé d'utiliser la valeur par défaut.

## Docker (méthode recommandée)

Une fois les fichiers `.env` correctements configurés, il suffit de lancer, dans `demo-service/docker` :

```shell
> docker-compose up -d --build
```

Si tout se passe correctement, une fois lancé, l'API devrait être accessible à l'adresse http://localhost:5001.

## À la main

Il vous faut installer et lancer une instance d'une base MongoDB. La documentation fourni des tutoriels détaillés selon l'environnement utilisé : https://docs.mongodb.com/manual/installation/.

Une fois installée et lancée, et l'API correctement configurée, il faut lancer cette dernière :

```shell
> # Dans le dossier demo-storage
> python3 -m venv venv
> source venv/bin/activate
> pip install --upgrade pip
> pip install -r requirements.txt
> export FLASK_PORT=5001 ; python main.py
```

Et une fois le front lancé, elle devrait être accessible à l'adresse http://localhost:5001.

À noter qu'il est possible d'activer le mode de développement de Flask qui permet, entre autre, d'avoir un rechargement automatique du script Python lancé lors de la modification d'un fichier source, ainsi qu'un affichage plus détaillé des erreurs qu'une simple erreur 500. Pour se faire il suffit d'exporter une nouvelle variable d'environnement avant de lancer l'API :

```shell
> export FLASK_ENV=development
```
