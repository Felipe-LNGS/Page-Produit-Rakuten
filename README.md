# 🛍️ Rakuten Product Page Clone

Ce projet est une réplique fonctionnelle et responsive d'une page produit **Rakuten**. 
Il a été développé avec **React**, **TypeScript** et **Material UI** pour démontrer la capacité à gérer des interfaces e-commerce complexes, l'intégration d'API et la gestion robuste des données.

## ✨ Fonctionnalités Clés

### 📱 Interface Utilisateur & UX
* **Design Responsive :** Adaptation parfaite du layout entre Mobile (colonnes empilées) et Desktop (layout "Sticky" avec colonnes côte à côte).
* **Material UI (MUI) :** Utilisation intensive du système de Grid, Typography, Paper et des composants interactifs (Chips, Collapse, Buttons).
* **Thématisation :** Respect de la charte graphique Rakuten (Couleur primaire `#BF0000`, gestion des états hover).

### 🛒 Fonctionnalités E-commerce
* **Bloc Prix Dynamique :** Affichage du meilleur prix, gestion des paiements en plusieurs fois (3x/4x) avec sécurisation des données manquantes.
* **Comparateur de Vendeurs :** * Liste des offres (Neuf/Occasion).
    * Distinction visuelle entre vendeurs classiques et partenaires ("Crew").
    * Affichage des conditions et du cashback pour les partenaires.
* **Variantes Produits :** Sélection dynamique des modèles (Couleurs, Capacité, etc.).

### 🛡️ Robustesse & Gestion d'Erreurs (Defensive Programming)
* **Nettoyage de Données (Sanitization) :** Algorithme personnalisé pour réparer les erreurs d'encodage de l'API (ex: correction automatique des caractères `¿` en `é` ou `™`).
* **Gestion des Images :** * Système de **Fallback** : Si une image produit ou un logo partenaire ne charge pas (404), une image par défaut ou un avatar généré (Initiale + Couleur) prend le relais automatiquement.
    * Masquage intelligent des éléments visuels cassés.
* **Rendu HTML Sécurisé :** Utilisation de `dangerouslySetInnerHTML` contrôlée pour afficher les descriptions riches (gras, couleurs) des vendeurs.
* **Page 404 & Validation :** Détection d'incohérence entre l'URL et le produit retourné (ex: afficher une erreur si on cherche un téléphone et que l'API renvoie un matelas).

## 🛠️ Stack Technique

* **Framework :** React 18
* **Langage :** TypeScript
* **UI Library :** @mui/material (Material UI) & @mui/icons-material
* **Data Fetching :** @tanstack/react-query
* **Build Tool :** Vite (ou Create React App selon votre config)

## 📂 Structure du Projet

```bash
racine-du-projet/
├── index.html              # Point d'entrée HTML (Vite)
├── package.json            # Dépendances (MUI, React Query...)
├── tsconfig.json           # Config TypeScript
├── vite.config.ts          # Config Vite
│
└── src/
    ├── main.tsx            # Point d'entrée React (Provider, Theme)
    ├── App.tsx             # Page principale (Layout, State, Logique)
    ├── api.ts              # Fetcher API + Fonctions de nettoyage (cleanContent/Seller)
    ├── types.ts            # Toutes tes interfaces (Product, Advert, Crew...)
    │
    └── components/         # Tes blocs d'interface réutilisables
        ├── CrewAdvertCard.tsx  # Carte spéciale partenaires
        ├── PriceBlock.tsx      # Le prix et les boutons d'achat
        ├── SellersList.tsx     # La liste des autres vendeurs
        ├── ReviewsBlock.tsx    # Les étoiles et commentaires
        └── TechSpecs.tsx       # Le tableau des caractéristiques
```

## ⚙️ Installation et Configuration

Suivez ces étapes pour installer et lancer le projet sur votre machine locale.

### Prérequis

Assurez-vous d'avoir installé :
* **Node.js** (v16 ou supérieur recommandé)
* **npm** (installé automatiquement avec Node) ou **yarn**

### Étapes d'installation

1.  **Cloner le dépôt**
    Récupérez le code source sur votre machine :
    ```bash
    git clone https://github.com/Felipe-LNGS/Page-Produit-Rakuten.git
    cd Page-Produit-Rakuten
    ```

2.  **Installer les dépendances**
    Installez toutes les librairies nécessaires (React, MUI, TanStack Query, etc.) :
    ```bash
    npm install
    # ou si vous préférez yarn :
    # yarn install
    ```

3.  **Lancer le projet**
    Démarrez le serveur de développement local :
    ```bash
    npm run dev
    ```

4.  **Accéder à l'application**
    Ouvrez votre navigateur et allez à l'adresse indiquée dans le terminal (généralement `http://localhost:5173` avec Vite).

### Scripts disponibles

* `npm run dev` : Lance l'app en mode développement.
* `npm run build` : Crée la version optimisée pour la mise en ligne (production).
* `npm run preview` : Prévisualise la version de production localement.
