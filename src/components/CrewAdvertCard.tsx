import { useState } from 'react';
import { Box, Typography, Paper, Button, Chip, Collapse, List, ListItem, ListItemIcon, ListItemText, Avatar } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LaunchIcon from '@mui/icons-material/Launch';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { Advert } from '../types';
import { formatPrice } from '../api';

interface CrewAdvertCardProps {
    advert: Advert;
}

export const CrewAdvertCard = ({ advert }: CrewAdvertCardProps) => {
    // Je gère l'état d'ouverture des conditions (accordéon)
    const [showConditions, setShowConditions] = useState(false);
    // J'ajoute une sécurité : si l'image du logo ne charge pas, je bascule sur l'avatar
    const [logoError, setLogoError] = useState(false);

    // Sécurité : Si les détails partenaires sont manquants, je n'affiche rien pour éviter un crash
    if (!advert.crewDetails) return null;

    const { brand, access } = advert.crewDetails;
    const isPercent = brand.cashback.type === 'p';

    // Petite fonction utilitaire que j'ai faite pour générer une couleur de fond unique 
    // basée sur le nom du vendeur (pour que l'avatar soit joli et consistant)
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
                p: 0,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 2,
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: 3, borderColor: 'primary.main' }
            }}
        >
            {/* --- EN-TÊTE : Identité et Cashback --- */}
            <Box sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #f5f5f5'
            }}>

                {/* Partie Gauche : Logo ou Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

                    {/* J'affiche le logo s'il existe et s'il n'est pas cassé, sinon je fallback sur l'avatar */}
                    {brand.logo && !logoError ? (
                        <img
                            src={brand.logo}
                            alt={brand.name}
                            loading="lazy" // Optimisation : chargement différé pour la perf
                            style={{ height: 40, maxWidth: 100, objectFit: 'contain' }}
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                                sx={{
                                    bgcolor: stringToColor(brand.name),
                                    width: 40,
                                    height: 40,
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {brand.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {brand.name}
                            </Typography>
                        </Box>
                    )}

                    <Chip
                        label="Partenaire"
                        size="small"
                        variant="outlined"
                        sx={{
                            borderColor: '#e0e0e0',
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            height: 24,
                            ml: 1
                        }}
                    />
                </Box>

                {/* Badge Cashback mis en avant */}
                <Chip
                    label={`+ ${brand.cashback.value}${isPercent ? '%' : '€'} Remboursés`}
                    size="small"
                    sx={{
                        bgcolor: '#FFF0F0',
                        color: 'primary.main',
                        fontWeight: 'bold',
                        border: '1px solid',
                        borderColor: 'primary.light'
                    }}
                />
            </Box>

            {/* --- CORPS : Prix et Action --- */}
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>

                    <Box>
                        <Typography variant="h5" color="text.primary" fontWeight="bold">
                            {formatPrice(advert.salePrice)} €
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Prix sur le site {brand.name}
                        </Typography>
                    </Box>

                    {/* Bouton vers le site partenaire (lien externe) */}
                    <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        endIcon={<LaunchIcon />}
                        href={access.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            px: 4,
                            fontWeight: 'bold',
                        }}
                    >
                        Choisir
                    </Button>
                </Box>

                {/* --- CONDITIONS (Accordéon dépliable) --- */}
                {access.conditions && access.conditions.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                        <Button
                            size="small"
                            startIcon={showConditions ? <ExpandLessIcon /> : <InfoOutlinedIcon />}
                            onClick={() => setShowConditions(!showConditions)}
                            sx={{
                                color: 'text.disabled',
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                minHeight: 0,
                                p: 0,
                                '&:hover': { bg: 'transparent', textDecoration: 'underline' }
                            }}
                            disableRipple
                        >
                            Conditions
                        </Button>

                        <Collapse in={showConditions}>
                            <Box sx={{ mt: 1, p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
                                <List dense disablePadding>
                                    {access.conditions.map((condition, index) => (
                                        <ListItem key={index} disablePadding sx={{ alignItems: 'flex-start', mb: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 20, mt: 0.3 }}>
                                                <CheckCircleOutlineIcon sx={{ fontSize: 14 }} color="success" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={condition}
                                                primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        </Collapse>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};