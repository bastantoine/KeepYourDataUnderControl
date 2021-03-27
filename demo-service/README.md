# Service de démo *« à la Instagram »*

Cette application web est conçue pour permettre de tester l'implémentation des principes proposés au sein de l'extension. Elle fonctionne autour de deux services :
 - Une API tournant sous Flask
 - Un frontend conçu avec Flask lui aussi

# Installation

Deux méthodes sont possibles pour installer et faire fonctionner cette application : en utilisant Docker et le fichier `docker-compose.yml` fourni ou à la main.

## Configuration préalable de l'API et du frontend

Ces deux services Flask doivent être configurés au préalables afin de pouvoir fonctionner correctement. Pour ce faire, chacun utilise un fichier `.env` contenant une liste de variables d'environnement.

Pour les configurer correctement, il suffit de dupliquer les fichiers `.env.sample` présents dans les dossiers `api` et `front` en les renommant tout deux `.env`, et modifier si nécessaire les valeurs présentes.

### `front/.env`

Variable | Valeur par défaut | Description
---------|-------------------|------------
`API_ENDPOINT` | `http://localhost:5000` | URL de l'API

**Note pour l'utilisation de Docker et docker-compose**

Dans le cas de l'utilisation du fichier `docker-compose.yml` pour le déploiement de l'application, il est nécessaire d'utiliser `http://api:5000`, `api` étant le nom du service déclaré dans le `docker-compose.yml`. Cette nécessité est liée au fait que les deux services `api` et `front` sont déclarés comme appartenant à un réseau privé de type bridge (voir [ce billet de blog](https://www.docker.com/blog/understanding-docker-networking-drivers-use-cases/) pour comprendre et l'intérêt et les implications).

### `api/.env`

Variable | Valeur par défaut | Description
---------|-------------------|------------
`API_UPLOAD_FOLDER` | `upload_folders` | Le dossier à utiliser pour stocker les fichiers envoyés au service. Doit être un chemin vers un dossier, soit absolu, soit relatif à `demo-service/api`. À noter que le dossier est créé automatiquement au lancement de l'application s'il n'existe pas déjà.
`API_ROOT_PATH` | `http://localhost:5000` | URL complète sur laquelle est accessible l'API. DOIT nécessairement commencer par `http(s)`.

**Note pour l'utilisation de Docker et docker-compose**

Dans le cas de l'utilisation du fichier `docker-compose.yml`, le dossier pointé par `API_UPLOAD_FOLDER` n'est pas monté en tant que volume, et donc n'est pas exposé à l'extérieur du conteneur, il n'y a donc que peu d'intérêt à modifier la valeur par défaut.

Par ailleurs, contrairement à la configuration du frontend, `API_ROOT_PATH` ne doit pas être `http://api:5000`. Cette variable est utilisée pour construire les liens complets permettant d'accèder aux fichiers envoyés. Ainsi cette URL doit pouvoir être accessible depuis l'extérieur du conteneur ce qui n'est pas le cas pour `http://api:5000`.

## Docker (méthode recommandée)

Une fois les fichiers `.env` correctements configurés, il suffit de lancer, dans `demo-service/docker` :

```shell
> docker-compose up -d --build
```

Si tout se passe correctement, une fois lancé, le frontend devrait être accessible à l'adresse http://localhost:1337.

## À la main

Dans un premier temps, exécutez :

```shell
> # Dans le dossier demo-service
> cd api
> python3 -m venv venv
> source venv/bin/activate
> pip install --upgrade pip
> pip install -r requirements.txt
> export FLASK_PORT=5000 ; python main.py
```

Puis dans un second terminal, sans fermer le premier :

```shell
> # Dans le dossier demo-service
> cd front
> python3 -m venv venv
> source venv/bin/activate
> pip install --upgrade pip
> pip install -r requirements.txt
> export FLASK_PORT=1337 ; python main.py
```

Et une fois le front lancé, il devrait être accessible à l'adresse http://localhost:1337.

À noter qu'il est possible d'activer le mode de développement de Flask qui permet, entre autre, d'avoir un rechargement automatique du script Python lancé lors de la modification d'un fichier source, ainsi qu'un affichage plus détaillé des erreurs qu'une simple erreur 500. Pour se faire il suffit d'exporter une nouvelle variable d'environnement avant de lancer le front et/ou l'API :

```shell
> export FLASK_ENV=development
```
