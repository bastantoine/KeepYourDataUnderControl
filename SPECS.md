Ce document présente les spécifications techniques et fonctionnelles du projet *Keep Your Data Under Control*.

- [1. Ressources](#1-ressources)
  - [1.1. Types de ressources](#11-types-de-ressources)
  - [1.2. Accessibilité des ressources](#12-accessibilité-des-ressources)
  - [1.3. Balises HTML utilisées pour l'insertion des ressources](#13-balises-html-utilisées-pour-linsertion-des-ressources)
  - [1.4. Points à définir](#14-points-à-définir)
- [2. Extension navigateur pour l'affichage des ressources](#2-extension-navigateur-pour-laffichage-des-ressources)
- [3. Service *« à la Instagram »* pour la démonstration](#3-service--à-la-instagram--pour-la-démonstration)
  - [3.1. Points généraux à définir](#31-points-généraux-à-définir)
  - [3.2. Backend du service](#32-backend-du-service)
    - [3.2.1. Points à définir](#321-points-à-définir)
  - [3.3. Frontend](#33-frontend)
    - [3.3.1. Points à définir](#331-points-à-définir)
- [4. Application mobile](#4-application-mobile)

# 1. Ressources

Dans cette section nous définissons les ressources supportées par ce prototype, et précisons quelques suppositions que nous avons fait.

Par ressource, nous entendons n'importe quel média qui, dans le système mis en place, ne serait plus hébergé par le service l'utilisant, mais par l'utilisateur qui en permet l'usage par le service.

## 1.1. Types de ressources

Nous avons regroupé ces médias en 3 catégories:
- Images: fichiers `.jpg`, `.jpeg`, `.png`...
- Vidéos: fichiers `.avi`, `.mov`, `.mp4`,...
- Textes: tout type de fichiers qui peut être affiché dans un éditeur de texte classique. Néamoins nous avons décidé de supposer qu'**uniquement des fichiers `.txt`, ou bien du texte brut seraient acceptés** dans un premier temps

Par ailleurs nous avons supposé que **l'utilisateur fourni le bon type de ressources** lorsqu'il doit en fournir. Ainsi lorsqu'il est demandé de fournir un lien hypertexte pour une image, l'utilisateur fourni bien une image. De même pour une vidéo ou du texte.

## 1.2. Accessibilité des ressources

En ce qui concerne l'accessibilité des ressources, **elles doivent être accessibles par une simple requête HTTP**. Par ailleurs nous supposons qu'elles sont bien accesibles, et que si ça n'est pas le cas, l'extension chargée de l'affichage des ressources ne doit rien faire de particulier.

## 1.3. Balises HTML utilisées pour l'insertion des ressources

Afin d'inclure les liens vers les ressources à afficher, le service utilisera de nouvelles balises HTML. **Ces nouvelles balises utiliseront l'attribut `src` afin de contenir le lien vers la ressource à utiliser**. Elles doivent par ailleurs **accepter tous les [attributs universels](https://developer.mozilla.org/fr/docs/Web/HTML/Attributs_universels)** définis pour toutes les balises HTML. S'il s'avère qu'il est trop compliqué de supporter tous ces attributs, *il sera possible de ne supporter que les suivants : `class`, `id` et `style`*.

Le tableau ci dessous présente les nouvelles balises utilisées, ainsi que les remplacements attendus:

| Type de ressource | Nouvelle balise                          | Remplacement attendu                  |
|-------------------|------------------------------------------|---------------------------------------|
| Image             | `<eimg src="{link}" />`                  | `<img src="{link}" />`                |
| Vidéo             | `<evid src="{link}" />`                  | `<video><source src="{link}"></video>`|
| Texte             | `<etxt src="{link}" alt="{Alt text}" />` | `{content}|{Alt text}`   |

Deux cas se présentent si une ressource n'est pas disponible:
1. Une ressource de type image/video : les navigateurs web gèrent déjà correctement ce cas, **il a donc été choisi de ne rien faire de particulier** en plus de ce que propose déjà les navigateurs.
2. Une ressource de type texte : dans ce cas, **il a été choisi de laisser le choix aux services utilisant ces fonctionnalités la possibilité de définir un texte alternatif, dans l'attribut `alt`, qui sera affiché à la place de la ressource si elle n'était pas disponible**.

Dans le cas d'une ressource de texte, **il faudra s'assurer que le contenu soit correctement echappé**, afin d'éviter des potentielles failles XSS. De même **il faudra être bien attentif à ce que les retours à la ligne potentiellement présent dans la ressource à récupérer soit correctement traités** une fois la ressource injectée dans la page.

## 1.4. Points à définir

- [ ] Comment gérer les différents encoding possibles ? UTF-8 accepté uniquement ? Que faire pour un texte en UTF-8 dans une page en Latin1 ?

# 2. Extension navigateur pour l'affichage des ressources

Cette extension pour navigateur web sera là afin de simuler le comportement recherché, supposé implémenté directement dans le navigateur, et sera donc chargée de parcourir tout le code source d'une page web, afin de repérer les balises définies plus haut, afin d'effectuer les remplacements définis ci-dessus.

Dans un premier temps, **uniquement une extension pour Google Chrome sera nécessaire**, compte tenu de sa part de marché. Si la migration est relativement facile et que le temps restant le permet, il sera possible de créer une extension pour Firefox.

# 3. Service *« à la Instagram »* pour la démonstration

Afin de tester le fonctionnement de ce système, il sera nécessaire de créer un petit service *« à la Instagram »*.

Ce service **devra permettre de créer des *posts* contenant un lien vers une image ou une vidéo**.

Il **devra aussi être possible d'ajouter des commentaires sous des posts, sous la forme d'un lien vers un texte**. Par soucis de simplicité, **il ne sera pas possible d'ajouter un commentaire à un commentaire déjà existant**.

Par ailleurs, aussi pour des raisons de simplicité, **ce service ne consistera qu'en une unique page affichant les posts, et leur commentaires associés**, de manière linéaire par ordre chronologique de la date et heure de publication, le plus récent en premier. Ainsi **il n'y aura pas de page affichant uniquement un post et ses commentaires**.

## 3.1. Points généraux à définir

- [ ] Doit-il y avoir une partie admin ?
- [ ] L'utilisateur doit-il se connecter à un compte pour poster/commenter ?

## 3.2. Backend du service

Le backend du service consistera en une API RESTful, et sera donc totalement indépendant de l'implémentation du frontend, et ce afin de pouvoir facilement développer les applications mobiles par la suite.

Cette API exposera deux endpoints:

- `/posts/`: actions CRUD des posts via les méthodes HTTP standard `GET`, `POST`, `PUT` et `DEL`
  - `/posts/{id}/comments`: actions liées à la création de commentaires liés à un post identifié par son identifiant `id` via `POST`
- `/comments/`: actions liées à la modification et la suppression de commentaires déjà existants via `PUT` et `DEL` respectivement

### 3.2.1. Points à définir

- [ ] Quel framework utiliser ? Flask ? NodeJS ?

## 3.3. Frontend

### 3.3.1. Points à définir

- [ ] Quel framework utiliser ? Angular ? React ?

# 4. Application mobile

Une fois que le service de démonstration, ainsi que l'extension pour navigateur auront été mis en place, une application pour smartphone (iOS et/ou Android) sera développée.

Compte tenu de l'organisation, les spécifications pour cette application seront définies dans un second temps.
