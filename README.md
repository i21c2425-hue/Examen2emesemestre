# Gestion des Commandes et Produits (E-commerce)

Projet realise dans le cadre de l'examen ESSGAM - L2 GL (Adm et SQL Server - Projet, Aout 2026).

## Stack utilisee
- Base de donnees : MySQL (compatible SQL Server avec quelques adaptations)
- Backend : Node.js + Express
- Frontend : React (Vite) + TailwindCSS

## Organisation du dossier
```
gestion-commandes-produits/
├── backend/
│   ├── config/db.js          -> connexion a la BDD
│   ├── controllers/          -> logique metier (produits, commandes)
│   ├── routes/                -> routes de l'API
│   ├── server.js              -> demarrage du serveur Express
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/axiosClient.js -> config axios
│   │   ├── pages/              -> pages Produits et Commandes
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
├── sql/schema.sql            -> tables + procedures + trigger + vue
├── liens.txt
└── README.md
```

## Comment lancer le projet

1) D'abord la base de donnees : ouvrir MySQL et executer `sql/schema.sql`.

2) Le backend :
```bash
cd backend
npm install
cp .env.example .env   # a adapter selon ta config MySQL
npm run dev
```
API disponible sur http://localhost:5000

3) Le frontend :
```bash
cd frontend
npm install
npm run dev
```
App disponible sur http://localhost:5173

## Ce qui est deja fait
- CRUD produits (ajout, liste, suppression)
- Liste des commandes + changement de statut
- Creation de commande avec transaction SQL (deduction du stock, calcul du montant)
- Procedure stockee, trigger de verif de stock, vue SQL dans schema.sql

## A completer avant de rendre le projet
- Authentification (admin / client)
- CRUD complet pour les categories
- Un vrai formulaire de creation de commande cote frontend (choisir les produits + quantites)
- Des stats (chiffre d'affaires, produits les plus vendus...) via des requetes SQL
- Recherche et pagination sur la liste des produits
- Mettre le projet sur GitHub et completer liens.txt

Le sujet insiste bien sur le fait de pratiquer un maximum de SQL (jointures, sous-requetes,
procedures, triggers, vues) donc il vaut mieux enrichir schema.sql plutot que de tout faire
cote application.
