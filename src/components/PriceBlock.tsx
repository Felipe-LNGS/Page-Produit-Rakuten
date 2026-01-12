import { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Stack, Paper, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckIcon from '@mui/icons-material/Check';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import type { Product, Advert } from '../types';
import { formatPrice, getPaymentLogo } from '../api';

interface PriceBlockProps {
    product: Product;
    selectedAdvert: Advert | null;
}

export const PriceBlock = ({ product, selectedAdvert }: PriceBlockProps) => {

    // Je sécurise la récupération des options de paiement : je fallback sur un tableau vide
    // pour éviter que .map() ne fasse crasher l'application si l'API renvoie null.
    const allPaymentOptions = selectedAdvert?.monthlyPayments || product.buybox?.monthlyPayments || [];
    const [selectedIndex, setSelectedIndex] = useState(0);

    // UX : Si l'utilisateur change de vendeur ou de produit, je réinitialise
    // la sélection du paiement (ex: revenir sur 3x) pour éviter d'afficher une option invalide.
    useEffect(() => {
        setSelectedIndex(0);
    }, [selectedAdvert, product]);

    // Je détermine le prix et le vendeur à afficher dynamiquement en fonction de l'offre sélectionnée.
    const currentPrice = selectedAdvert ? selectedAdvert.salePrice : product.newBestPrice;
    const sellerName = selectedAdvert ? selectedAdvert.seller.login : "Rakuten";

    // SÉCURITÉ : Je vérifie toujours que l'option de paiement existe à cet index avant de l'afficher.
    const currentPayment = allPaymentOptions[selectedIndex];

    // Petit helper pour deviner le label (3x ou 4x) si le titre n'est pas explicite
    const getPaymentLabel = (title: string | undefined) => {
        if (!title) return "3x"; // Valeur par défaut
        return title.toLowerCase().includes("4") ? "4x" : "3x";
    };

    return (
        <Paper
            elevation={0}
            sx={{
                bgcolor: '#fcfcfc',
                p: 3,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                width: { md: '900px' },
            }}
        >
            {/* --- BLOC 1 : PRIX ET VENDEUR --- */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 0.5 }}>
                    {formatPrice(currentPrice)} €
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Vendu par <strong>{sellerName}</strong>
                </Typography>
            </Box>

            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

            {/* --- BLOC 2 : FACILITÉS DE PAIEMENT --- */}
            {/* Je n'affiche cette section que si des options de paiement sont disponibles */}
            {allPaymentOptions.length > 0 && currentPayment && (
                <Box sx={{ mb: 3 }}>

                    {/* Affichage des puces de sélection (3x / 4x) uniquement s'il y a le choix */}
                    {allPaymentOptions.length > 1 && (
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            {allPaymentOptions.map((opt, index) => {
                                const label = getPaymentLabel(opt.title);
                                const isSelected = index === selectedIndex;

                                return (
                                    <Chip
                                        key={index}
                                        label={label}
                                        onClick={() => setSelectedIndex(index)}
                                        color={isSelected ? "primary" : "default"}
                                        variant={isSelected ? "filled" : "outlined"}
                                        size="small"
                                        icon={isSelected ? <CreditCardIcon /> : undefined}
                                        clickable
                                    />
                                );
                            })}
                        </Stack>
                    )}

                    {/* Détails de l'option de paiement sélectionnée */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, bgcolor: 'white', p: 1.5, borderRadius: 1, border: '1px solid #f0f0f0', minHeight: '90px', flexWrap: 'wrap' }}>

                        {/* Gestion sécurisée de l'image du logo de paiement */}
                        {currentPayment.image && (
                            <img
                                src={getPaymentLogo(currentPayment.image)}
                                alt="Logo Paiement"
                                loading="lazy" // Optimisation : chargement différé
                                style={{ height: 20, marginTop: 4, objectFit: 'contain' }}
                                // Si l'image est cassée, je la cache proprement via onError
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        )}

                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {currentPayment.title || "Paiement en plusieurs fois"}
                            </Typography>

                            <Typography variant="caption" display="block" color="text.primary">
                                dès <strong>{formatPrice(currentPayment.monthlyAmount)} €</strong> / mois
                            </Typography>

                            {currentPayment.description && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic', lineHeight: 1.2 }}>
                                    {currentPayment.description}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}

            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

            {/* --- BLOC 3 : STOCK ET LIVRAISON --- */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CheckIcon color="success" fontSize="small" />
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                        En stock
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalShippingIcon color="disabled" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                        {selectedAdvert && selectedAdvert.shippingAmount > 0
                            ? `Livraison : ${formatPrice(selectedAdvert.shippingAmount)} €`
                            : "Livraison Gratuite"
                        }
                    </Typography>
                </Box>
            </Box>

            {/* Bouton d'action principal */}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={<ShoppingCartIcon />}
                sx={{ fontWeight: 'bold', fontSize: '1.1rem', py: 1.5 }}
            >
                Ajouter au panier
            </Button>
        </Paper>
    );
};