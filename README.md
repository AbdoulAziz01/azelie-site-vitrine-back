# Azélie — Backend API

API REST professionnelle en Node.js / Express pour le site Azélie : contact, devis, newsletter,
services, produits, réalisations, blog, témoignages et FAQ. L'architecture est prête pour
PostgreSQL (via Prisma) et pour un futur dashboard d'administration, sans avoir besoin de
modifier l'API existante.

## Stack technique

- **Node.js** + **Express 5**
- **PostgreSQL** via **Prisma ORM** (architecture prête, fonctionne même sans DB connectée)
- **JWT** (`jsonwebtoken`) pour l'authentification admin
- **Multer** pour l'upload d'images
- **Nodemailer** pour l'envoi d'emails (notifications contact/devis/newsletter)
- **Helmet**, **CORS**, **express-rate-limit** pour la sécurité
- **Morgan** pour les logs HTTP, **compression** pour la compression des réponses
- **express-validator** pour la validation des entrées
- **bcryptjs** pour le hash des mots de passe admin

## Architecture

```
backend/
├── prisma/
│   └── schema.prisma        # Modèle de données PostgreSQL
├── src/
│   ├── config/               # Configuration (env, DB, CORS, Multer)
│   ├── controllers/          # Logique des routes (une par ressource)
│   ├── routes/                # Définition des endpoints Express
│   ├── middlewares/          # auth, validation, rate limiting, erreurs, upload
│   ├── services/              # Email, authentification (hors accès direct DB)
│   ├── models/                 # Accès aux données (Prisma) par ressource
│   ├── validators/            # Règles de validation express-validator
│   ├── utils/                  # ApiError, ApiResponse, logger, pagination, slugify
│   ├── app.js                  # Configuration Express (middlewares globaux, routes)
│   └── server.js               # Point d'entrée (démarrage HTTP + DB)
├── uploads/
│   ├── images/                 # Images uploadées (services, produits, blog...)
│   └── documents/              # Documents éventuels
├── .env.example
└── package.json
```

Cette séparation config / controllers / routes / middlewares / services / models / validators / utils
permet de faire évoluer chaque couche indépendamment — notamment d'ajouter un dashboard
d'administration plus tard sans toucher à la logique métier existante (les routes admin sont
déjà protégées par JWT et prêtes à être consommées par une interface d'administration).

## Installation

```bash
npm install
```

Copier le fichier d'environnement et l'adapter :

```bash
cp .env.example .env
```

Variables importantes dans `.env` :

| Variable | Description |
|---|---|
| `PORT` | Port d'écoute du serveur (défaut `5000`) |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL (`postgresql://user:pass@host:port/db`) |
| `JWT_SECRET` | Secret utilisé pour signer les tokens admin |
| `CORS_ORIGINS` | Origines autorisées à appeler l'API (séparées par des virgules) |
| `SMTP_*` | Configuration d'envoi d'emails (optionnel — les emails sont simulés/journalisés si absent) |
| `MAX_FILE_SIZE_MB` | Taille max des images uploadées |

## Base de données (PostgreSQL + Prisma)

L'API **démarre même sans base de données configurée** — seules les routes nécessitant la DB
renverront une erreur tant qu'elle n'est pas connectée. Pour l'activer :

1. Renseigner `DATABASE_URL` dans `.env` avec une base PostgreSQL existante.
2. Générer les tables :
   ```bash
   npx prisma migrate dev --name init
   ```
3. (Optionnel) Explorer les données avec Prisma Studio :
   ```bash
   npm run prisma:studio
   ```

Scripts utiles :

- `npm run prisma:generate` — régénère le client Prisma après modification du schéma
- `npm run prisma:migrate` — crée/applique une migration
- `npm run prisma:studio` — interface graphique pour consulter/éditer les données

## Lancer le backend

```bash
# Mode développement (rechargement automatique via nodemon)
npm run dev

# Mode production
npm start
```

Le serveur écoute par défaut sur `http://localhost:5000`. Vérifier qu'il fonctionne :

```bash
curl http://localhost:5000/api/health
```

## Créer le premier compte administrateur

Tant qu'aucun administrateur n'existe en base, l'inscription est ouverte sans authentification
(bootstrap). Une fois le premier compte créé, seule une personne avec le rôle `SUPER_ADMIN`
peut en créer d'autres.

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@azelie.com","password":"MotDePasseSecurise123","fullName":"Admin Azélie","role":"SUPER_ADMIN"}'
```

Puis se connecter :

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@azelie.com","password":"MotDePasseSecurise123"}'
```

La réponse contient un `token` JWT à utiliser en header `Authorization: Bearer <token>`
pour toutes les routes d'administration (création/modification/suppression de contenu,
consultation des messages de contact/devis, etc.).

## Endpoints principaux

Toutes les routes sont préfixées par `/api`.

### Contact
| Méthode | Route | Accès |
|---|---|---|
| POST | `/contact` | Public — envoyer un message |
| GET | `/contact` | Admin — lister les messages (pagination `?page&limit&status`) |
| GET | `/contact/:id` | Admin |
| PATCH | `/contact/:id/status` | Admin — changer le statut (`NEW`, `IN_PROGRESS`, `ANSWERED`, `CLOSED`) |
| DELETE | `/contact/:id` | Admin |

### Demandes de devis
| Méthode | Route | Accès |
|---|---|---|
| POST | `/quotes` | Public |
| GET | `/quotes` | Admin |
| GET | `/quotes/:id` | Admin |
| PATCH | `/quotes/:id/status` | Admin |
| DELETE | `/quotes/:id` | Admin |

### Newsletter
| Méthode | Route | Accès |
|---|---|---|
| POST | `/newsletter/subscribe` | Public |
| POST | `/newsletter/unsubscribe` | Public |
| GET | `/newsletter` | Admin |
| DELETE | `/newsletter/:id` | Admin |

### Services, Produits, Réalisations, Blog
Structure identique pour ces quatre ressources (`/services`, `/products`, `/realisations`, `/blog`) :

| Méthode | Route | Accès |
|---|---|---|
| GET | `/<ressource>` | Public (retourne uniquement les éléments actifs/publiés) — Admin authentifié voit tout |
| GET | `/<ressource>/:slug` | Public |
| POST | `/<ressource>` | Admin (upload d'image(s) possible via `multipart/form-data`) |
| PUT | `/<ressource>/:id` | Admin |
| DELETE | `/<ressource>/:id` | Admin |

### Témoignages
| Méthode | Route | Accès |
|---|---|---|
| GET | `/testimonials` | Public/Admin |
| POST | `/testimonials` | Public (soumission client, inactif par défaut jusqu'à validation) |
| PUT | `/testimonials/:id` | Admin |
| DELETE | `/testimonials/:id` | Admin |

### FAQ
| Méthode | Route | Accès |
|---|---|---|
| GET | `/faqs` | Public/Admin |
| POST | `/faqs` | Admin |
| PUT | `/faqs/:id` | Admin |
| DELETE | `/faqs/:id` | Admin |

### Authentification
| Méthode | Route | Accès |
|---|---|---|
| POST | `/auth/login` | Public |
| POST | `/auth/register` | Bootstrap ou `SUPER_ADMIN` |
| GET | `/auth/me` | Admin |

Toutes les réponses suivent le format :
```json
{ "success": true, "message": "...", "data": {}, "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 1 } }
```

## Sécurité mise en place

- **Helmet** — en-têtes HTTP sécurisés
- **CORS** — restreint aux origines listées dans `CORS_ORIGINS`
- **Rate limiting** — global (`/api`) + limiteur strict sur les endpoints publics sensibles (contact, devis, newsletter, login)
- **Validation stricte** de toutes les entrées via `express-validator`
- **JWT** avec expiration configurable pour les routes d'administration
- **Mots de passe hashés** avec bcrypt (12 rounds)
- **Upload restreint** : types d'images autorisés (JPEG, PNG, WEBP, GIF) et taille max configurable
- **Gestion centralisée des erreurs** avec messages contrôlés (pas de fuite de stack trace en production)

## Ajouter une nouvelle ressource

1. Ajouter le modèle dans `prisma/schema.prisma`, puis `npm run prisma:generate` et `npm run prisma:migrate`.
2. Créer `src/models/<ressource>.model.js` (accès Prisma).
3. Créer `src/validators/<ressource>.validator.js` (règles express-validator).
4. Créer `src/controllers/<ressource>.controller.js` (logique métier).
5. Créer `src/routes/<ressource>.routes.js` et l'enregistrer dans `src/routes/index.js`.

Cette structure reste identique quel que soit le futur frontend d'administration.
#   a z e l i e - s i t e - v i t r i n e - b a c k  
 