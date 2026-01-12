import type { Product } from './types';

const API_URL = "https://api-rakuten-vis.koyeb.app/product/";

// --- FONCTION 1 : SPÉCIALE VENDEURS ---
// Ici, on sait que l'encodage est cassé et que ¿ = é
export const cleanSellerComment = (text: string | undefined) => {
  if (!text) return "Aucune description.";
  
  return text
    // Fix spécifique aux vendeurs Rakuten (ex: exp¿di¿ -> expédié)
    .replace(/FC¿/g, "FC™")
    // Règle générale pour les vendeurs : tout ¿ restant devient un é
    .replace(/¿/g, 'é') 
    .trim();
};

// --- FONCTION 2 : DESCRIPTION ET AVIS ---
// Ici, on gère le HTML et on SUPPRIME les ¿ car ce ne sont pas des é
export const cleanContent = (text: string | undefined) => {
  if (!text) return "";
  
  return text
    // Nettoyage HTML pour la description produit
    .replace(/\? /g, "• ")
    .replace(/<br\/>/g, "<br/><br/>")
    // Nettoyage pour les avis : on supprime le caractère buggé au lieu de le remplacer
    .replace(/¿/g, "") 
    .replace(/\.{2,}/g, ".") 
    .trim();
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

export const getPaymentLogo = (originalUrl: string) => {
  if (!originalUrl) return "";
  if (originalUrl.includes('PayPal')) return "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg";
  if (originalUrl.toLowerCase().includes('klarna')) return "https://upload.wikimedia.org/wikipedia/commons/4/40/Klarna_Payment_Badge.svg";
  return originalUrl;
};

export const fetchProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_URL}${id}`);
  if (!response.ok) throw new Error('Erreur réseau');
  const result = await response.json();
  if (!result.data || !result.data.headline) throw new Error('Données produit manquantes');
  return result.data;
};