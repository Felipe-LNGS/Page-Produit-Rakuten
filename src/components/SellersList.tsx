import { useState } from 'react';
import { Box, Typography, Paper, Button, Chip, Stack, Avatar, Collapse } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import type { Product, Advert } from '../types';
import { formatPrice, cleanSellerComment } from '../api';
import { CrewAdvertCard } from './CrewAdvertCard';

interface SellersListProps {
    product: Product;
    onSelectAdvert: (advert: Advert) => void;
}

export const SellersList = ({ product, onSelectAdvert }: SellersListProps) => {
    // Si pas d'offres, je n'affiche rien pour garder l'interface propre
    if (!product.adverts || product.adverts.length === 0) return null;

    return (
        <Box sx={{ mt: 5, mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StorefrontIcon color="primary" />
                Comparateur de prix ({product.adverts.length} offres)
            </Typography>

            <Stack spacing={2}>
                {product.adverts.map((ad: Advert) => {
                    // LOGIQUE DE DÉCISION :
                    // Si l'offre possède des détails "Crew" (partenaire externe avec cashback), 
                    // j'utilise la carte spécifique CrewAdvertCard qui gère les liens externes.
                    if (ad.isCrew || ad.crewDetails) {
                        return <CrewAdvertCard key={ad.advertId} advert={ad} />;
                    }
                    
                    // Sinon, c'est un vendeur classique (marketplace), j'utilise la carte standard.
                    return (
                        <AdvertCard
                            key={ad.advertId}
                            advert={ad}
                            onSelect={onSelectAdvert}
                        />
                    );
                })}
            </Stack>
        </Box>
    );
};

// --- COMPOSANT INTERNE : Carte pour un vendeur standard ---
const AdvertCard = ({ advert, onSelect }: { advert: Advert, onSelect: (ad: Advert) => void }) => {
    const [showDescription, setShowDescription] = useState(false);

    // Fonction utilitaire pour générer une couleur d'avatar unique par vendeur
    const stringToColor = (string: string) => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.substr(-2);
        }
        return color;
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: '1px solid #eee',
                transition: 'all 0.2s',
                // UX : Feedback visuel au survol pour inciter au clic
                '&:hover': { borderColor: '#BF0000', bgcolor: '#fffdfd', cursor: 'pointer' }
            }}
            // Le clic sur toute la carte sélectionne l'offre
            onClick={() => onSelect(advert)}
        >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 2 }}>
                
                {/* 1. IDENTITÉ DU VENDEUR */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    {/* Avatar généré avec les initiales */}
                    <Avatar 
                        sx={{ 
                            bgcolor: stringToColor(advert.seller.login), 
                            color: 'white', 
                            fontWeight: 'bold' 
                        }}
                    >
                        {advert.seller.login.charAt(0).toUpperCase()}
                    </Avatar>
                    
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {advert.seller.login}
                            </Typography>
                            <Chip label="PRO" size="small" variant="outlined" sx={{ height: 20, fontSize: '0.6rem', borderRadius: 1 }} />
                        </Box>
                        
                        <Typography variant="caption" display="block" color="text.secondary">
                             {advert.seller.averageScore ? `${advert.seller.averageScore}/5` : 'Nouveau vendeur'}
                        </Typography>
                        
                        <Typography variant="caption" color={advert.quality === 'NEW' ? "success.main" : "warning.main"} fontWeight="bold">
                            {advert.quality === 'NEW' ? 'Produit Neuf' : 'Occasion'}
                        </Typography>
                    </Box>
                </Box>

                {/* 2. FRAIS DE PORT & DÉLAIS */}
                <Box sx={{ textAlign: 'center', minWidth: '180px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                        <LocalShippingIcon sx={{ fontSize: 16, color: advert.shippingAmount === 0 ? 'green' : 'inherit' }} />
                        <Typography variant="caption" color={advert.shippingAmount === 0 ? "success.main" : "text.primary"} fontWeight="bold">
                            {advert.shippingAmount === 0 ? "Livraison Gratuite" : `+ ${formatPrice(advert.shippingAmount)} € de port`}
                        </Typography>
                    </Box>
                    {advert.shippingDelay && (
                        <Typography variant="caption" color="text.secondary" display="block">
                            {advert.shippingDelay}
                        </Typography>
                    )}
                </Box>

                {/* 3. PRIX ET BOUTON D'ACTION */}
                <Box sx={{ textAlign: { xs: 'center', md: 'right' }, minWidth: 140 }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                        {formatPrice(advert.salePrice)} €
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="small" 
                        startIcon={<TouchAppIcon />}
                        sx={{ mt: 0.5, fontWeight: 'bold', borderRadius: 5, textTransform: 'none' }}
                        onClick={(e) => { 
                            e.stopPropagation(); // J'empêche le clic de se propager au parent
                            onSelect(advert); 
                        }}
                    >
                        Choisir
                    </Button>
                </Box>
            </Box>
            
            {/* ZONE DE DESCRIPTION (Dépliable) */}
            {advert.sellerComment && (
                <Box sx={{ mt: 1 }}>
                    <Button 
                        size="small" 
                        sx={{ fontSize: '0.7rem', textTransform: 'none', color: 'primary.main', fontWeight: 'bold', p: 0 }}
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            setShowDescription(!showDescription); 
                        }}
                        endIcon={showDescription ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    >
                        {showDescription ? "Masquer la description" : "Voir la description"}
                    </Button>
                    <Collapse in={showDescription}>
                        <Typography 
                            variant="body2" 
                            color="text.secondary" 
                            sx={{ mt: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, fontSize: '0.85rem' }}
                        >
                            {/* Nettoyage du texte avant affichage */}
                            {cleanSellerComment(advert.sellerComment)}
                        </Typography>
                    </Collapse>
                </Box>
            )}
        </Paper>
    );
};