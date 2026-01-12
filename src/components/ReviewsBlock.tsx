import { Box, Typography, Rating, Avatar, Stack, Paper, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { Product, Review } from '../types';
// J'importe mes fonctions utilitaires ici pour éviter de redéclarer formatDate à chaque rendu
import { cleanContent, formatDate } from '../api';

interface ReviewsBlockProps {
    product: Product;
}

export const ReviewsBlock = ({ product }: ReviewsBlockProps) => {
    // Sécurité : Si le produit n'a pas d'avis, je retourne null pour ne pas afficher un bloc vide
    if (!product.reviews || product.reviews.length === 0) return null;

    return (
        <Box sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Avis clients ({product.reviews.length})
            </Typography>

            {/* --- BLOC RÉSUMÉ (Note globale) --- */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1 }}>
                <Typography variant="h3" fontWeight="bold" color="primary">
                    {product.globalRating?.score || 0}
                </Typography>
                <Box>
                    <Rating value={product.globalRating?.score || 0} precision={0.1} readOnly />
                    <Typography variant="caption" display="block" color="text.secondary">
                        sur 5
                    </Typography>
                </Box>
            </Box>

            {/* --- LISTE DES AVIS --- */}
            <Stack spacing={2}>
                {product.reviews.map((review: Review) => (
                    <Paper key={review.id} elevation={0} sx={{ p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                        
                        {/* En-tête de l'avis : Auteur + Date + Badge Achat vérifié */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                            {/* Avatar simple avec la première lettre du prénom */}
                            <Avatar sx={{ bgcolor: '#ccc' }}>
                                {review.author.firstName.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {review.author.firstName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {/* J'utilise le formateur de date partagé */}
                                    {formatDate(review.date)}
                                </Typography>
                            </Box>
                            
                            {/* Badge affiché uniquement sur desktop/tablette (hidden sur mobile xs) */}
                            <Chip
                                icon={<CheckCircleIcon />}
                                label="Achat vérifié"
                                size="small"
                                variant="outlined"
                                color="success"
                                sx={{ ml: 'auto', display: { xs: 'none', sm: 'flex' } }}
                            />
                        </Box>

                        {/* Note et Titre du commentaire */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <Rating value={review.note} size="small" readOnly />
                            <Typography variant="subtitle1" fontWeight="bold">
                                {review.title}
                            </Typography>
                        </Box>

                        {/* Contenu de l'avis nettoyé des caractères spéciaux */}
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {cleanContent(review.description)}
                        </Typography>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
};