// --- TYPES COMMUNS ---

// Je définis ici la structure des facilités de paiement (3x, 4x)
// Ces infos sont utilisées dans le PriceBlock pour afficher les mensualités.
export interface PaymentOption {
  title: string;
  description: string;
  monthlyAmount: number;
  image?: string;
}

// Infos de base sur le vendeur (Nom, Note, Avatar)
// J'ai ajouté l'avatarUrl optionnel pour gérer l'affichage dans la SellersList.
export interface Seller {
  id: number;
  login: string;
  averageScore?: number;
  avatarUrl?: string;
}

// --- TYPES SPÉCIFIQUES PARTENAIRES (CREW) ---

// Cette interface est cruciale pour gérer les offres "Partenaires" (ex: Pixmania, Auchan)
// qui ont des données spécifiques comme le Cashback ou un lien externe.
export interface CrewDetails {
  brand: {
    name: string;
    logo: string;
    illustration?: string;
    illustrationBackground?: string;
    cashback: {
      value: number;
      type: string; // 'p' pour pourcentage (%), 'c' pour currency (€)
    };
  };
  access: {
    link: string; // Le lien de redirection vers le site partenaire
    conditions: string[];
  };
}

// --- TYPE OFFRE (ADVERT) ---

// C'est l'objet qui représente une ligne dans le comparateur de prix.
// J'ai rendu 'crewDetails' optionnel car seules les offres partenaires en ont besoin.
export interface Advert {
  advertId: number;
  salePrice: number;
  shippingAmount: number;
  shippingDelay?: string;
  sellerComment?: string;
  quality: string; // 'NEW' ou 'USED'
  seller: Seller;
  monthlyPayments?: PaymentOption[];
  
  // Drapeaux pour identifier si c'est une offre partenaire
  isCrew?: boolean;
  crewDetails?: CrewDetails;
}

// --- TYPE AVIS CLIENT (REVIEW) ---

export interface Review {
  id: number;
  note: number;
  title: string;
  description: string;
  date: number;
  author: {
    firstName: string;
    isUserBuyer?: boolean; // Permet d'afficher le badge "Achat vérifié"
  };
}

// --- TYPE PRINCIPAL PRODUIT ---

// L'objet complet retourné par l'API /product.
// C'est le cœur de mon application, contenant toutes les données nécessaires à l'affichage.
export interface Product {
  id: number;
  headline: string;
  description: string;
  edito?: string; // Parfois la description riche est ici
  newBestPrice: number;
  originalPrice?: number;
  imagesUrls: string[];
  
  // Note globale (étoiles)
  globalRating?: { score: number; nbReviews: number };
  
  // Fil d'ariane pour la navigation
  breadcrumbs?: { label: string; url: string }[];
  
  // Gestion des variantes (ex: Couleurs, Capacités)
  declinationGroupsFromMFP?: {
    groups: { groupKeyValue: string; groupProducts: { id: number }[] }[];
  };

  // Caractéristiques techniques (Tableaux de specs)
  specifications?: {
    sections: {
      entry: { title: string; content: { header: string; body: string }[] }[];
    }[];
  };

  reviews?: Review[];
  adverts?: Advert[];

  // La "Buybox" représente l'offre mise en avant (par défaut la moins chère)
  buybox?: {
    advertId: number;
    salePrice: number;
    shippingAmount: number;
    seller: Seller;
    monthlyPayments?: PaymentOption[];
  };
}