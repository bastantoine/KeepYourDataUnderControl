Ce document présente les spécifications techniques de l'API RESTful du backend du service utilisé en démonstration du projet *Keep Your Data Under Control*.

- [Description des données retournées](#description-des-données-retournées)
- [`/posts`](#posts)
  - [`GET /posts/`](#get-posts)
  - [`POST /posts/`](#post-posts)
  - [`PUT /posts/{id}`](#put-postsid)
  - [`DEL /posts/{id}`](#del-postsid)
  - [Others](#others)
- [`/posts/{id}/comments`](#postsidcomments)
  - [`POST /posts/{id}/comments`](#post-postsidcomments)
  - [Others](#others-1)
- [`/comments/`](#comments)
  - [`PUT /comments/{id}`](#put-commentsid)
  - [`DEL /comments/{id}`](#del-commentsid)
  - [Others](#others-2)

# Description des données retournées

Dans le cas où une requête retourne une quelconque information dans son corps, les données seront sous forme de JSON. Par ailleurs, dès lors qu'une requête retourne une information, que ça soit un post, un commentaire ou bien une liste de l'un et/ou de l'autre, chaque élèment possède toujours deux attribut :
- son identifiant: `id`
- le lien vers la ressource associée (image ou vidéo pour les posts, texte pour les commentaires): `link`

# `/posts`

## `GET /posts/`

Cette requête GET récupère tous les posts ainsi que le commentaires qui leur sont associés.

Une requête `GET /posts/` renvoierait une réponse avec un corps suivant ce schéma :

```json
{
    "posts": [
        {
            "id": "{id_post}",
            "link": "{link_to_ressource}",
            "comments": [
                {
                    "id": "{id_comment}",
                    "link": "{link_to_ressource}"
                },
                ...
            ]
        },
        ...
    ]
}
```

## `POST /posts/`

Cette requête permet de créer un post.

Le corps doit être sous la forme d'un JSON avec comme unique clé `link` ayant comme valeur le lien de la ressource pour laquelle créer le post.

```json
{
    "link": "{link_to_ressource}"
}
```

La réponse contient un JSON avec deux clés: `link` défini avec le même lien que celui fourni, et `id` défini avec l'identifiant du post nouvellement créé.

```json
{
    "id": "{id_post}",
    "link": "{link_to_ressource}"
}
```

## `PUT /posts/{id}`

Cette requête permet de mettre à jour un post, identifié par son identifiant `id` passé dans l'URL de la requête, en changeant la ressource utilisée.

Le corps doit être sous la forme d'un JSON avec comme unique clé `link` ayant comme valeur le lien de la ressource à utiliser dans la mise à jour du post.

```json
{
    "link": "{link_to_ressource}"
}
```

La réponse contient un JSON avec deux clés: `link` défini avec le même lien que celui fourni, et `id` défini avec l'identifiant du post.

```json
{
    "id": "{id_post}",
    "link": "{link_to_ressource}"
}
```

## `DEL /posts/{id}`

Supprime le post identifié par son identifiant `id` passé dans l'URL de la requête.

Retourne un HTTP 200 si la suppression a été effectué correctement.

## Others

Tout autre requête HTTP autre que celles définies ce dessus retournera une erreur `405 Method not supported`.

# `/posts/{id}/comments`

## `POST /posts/{id}/comments`

Cette requête permet de créer un commentaire associé à un post.

Le post auquel associer le commentaire est identifié par son identifiant `id` contenu dans l'URL de la requête.

Le corps doit être sous la forme d'un JSON avec comme unique clé `link` ayant comme valeur le lien de la ressource à utiliser pour le contenu du commentaire.

```json
{
    "link": "{link_to_ressource}"
}
```

La réponse contient un JSON avec deux clés: `link` défini avec le même lien que celui fourni, et `id` défini avec l'identifiant du commentaire nouvellement créé.

```json
{
    "id": "{id_comment}",
    "link": "{link_to_ressource}"
}
```

## Others

Tout autre requête HTTP autre que celles définies ce dessus retournera une erreur `405 Method not supported`.

# `/comments/`

## `PUT /comments/{id}`

Cette requête permet de metre à jour un commentaire.

Le commentaire à mettre à jour est identifié par son identifiant `id` contenu dans l'URL de la requête.

Le corps doit être sous la forme d'un JSON avec comme unique clé `link` ayant comme valeur le lien de la ressource à utiliser pour le contenu du commentaire mis à jour.

```json
{
    "link": "{link_to_ressource}"
}
```

La réponse contient un JSON avec deux clés: `link` défini avec le même lien que celui fourni, et `id` défini avec l'identifiant du commentaire.

```json
{
    "id": "{id_comment}",
    "link": "{link_to_ressource}"
}
```

## `DEL /comments/{id}`

Supprime le commentaire identifié par son identifiant `id` contenu dans l'URL de la requête.

Retourne un HTTP 200 si la suppression a été effectué correctement.

## Others

Tout autre requête HTTP autre que celles définies ce dessus retournera une erreur `405 Method not supported`.
