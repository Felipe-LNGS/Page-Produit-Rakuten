import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import type { Product } from '../types';

interface TechSpecsProps {
    product: Product;
}

export const TechSpecs = ({ product }: TechSpecsProps) => {
    // Sécurité : Je vérifie d'abord si les spécifications existent via l'optional chaining (?.)
    // Si la liste est vide ou manquante, je ne rends rien pour éviter un titre vide sur la page.
    if (!product.specifications?.sections?.entry?.length) return null;

    return (
        <Box sx={{ mb: 4, mt: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Caractéristiques Techniques
            </Typography>

            {/* Je boucle sur chaque section technique (ex: "Écran", "Connectivité") */}
            {product.specifications.sections.entry.map((section, index) => (
                <Box key={index} sx={{ mb: 3 }}>

                    {/* En-tête de la section avec un style gris pour bien séparer les blocs */}
                    <Typography
                        variant="subtitle2"
                        sx={{
                            bgcolor: '#eee',
                            p: 1,
                            pl: 2,
                            borderRadius: '4px 4px 0 0',
                            fontWeight: 'bold',
                            border: '1px solid #e0e0e0',
                            borderBottom: 'none'
                        }}
                    >
                        {section.title}
                    </Typography>

                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '0 0 4px 4px' }}>
                        <Table size="small">
                            <TableBody>
                                {/* Je boucle sur les lignes de détails (Header = label, Body = valeur) */}
                                {section.content.map((item, idx) => (
                                    <TableRow key={idx} hover>
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            sx={{
                                                width: '35%',
                                                bgcolor: '#fafafa',
                                                fontWeight: 600,
                                                color: 'text.secondary',
                                                verticalAlign: 'top'
                                            }}
                                        >
                                            {item.header}
                                        </TableCell>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            {item.body}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ))}
        </Box>
    );
};