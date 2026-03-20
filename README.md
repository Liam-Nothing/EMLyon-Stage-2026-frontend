# JointIn

Site web permettant de regrouper plusieurs liens dans une seule page de biographie (à la manière de Linktree).

## Fonctionnalités

- Page de profil publique avec photo, nom et bio
- Affichage de liens personnalisés (portfolio, réseaux sociaux, projets...)
- Interface d'administration pour gérer les liens
- API REST pour récupérer les données

## Structure du projet

```
├── front/          # Frontend (HTML, CSS, JS)
│   ├── index.html          # Page profil publique
│   ├── admin/              # Interface d'administration
│   ├── profil-publique/    # Composants du profil
│   └── assets/             # Images et ressources
│
└── back/           # Backend (Node.js / Express)
    ├── server.js           # Point d'entrée du serveur
    ├── routes/             # Routes de l'API
    └── data/               # Données
```

## Installation

```bash
cd back
npm install
npm start
```

Le serveur tourne sur `http://localhost:3000`.

## Endpoints API

| Méthode | Route              | Description                        |
|---------|--------------------|------------------------------------|
| GET     | `/api/test`        | Vérifie que l'API fonctionne       |
| GET     | `/api/hello/:name` | Retourne un message de bienvenue   |
| GET     | `/api/links`       | Retourne la liste des liens        |

## Auteurs

El Mehdi, Salsabila
