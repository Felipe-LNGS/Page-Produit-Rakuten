import { useState, useEffect, useRef } from 'react'; // J'ai ajouté useRef ici
import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Typography, CircularProgress, Breadcrumbs, Link, Box, AppBar, Toolbar, Rating, Paper, Select, MenuItem, Stack, Chip, Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import { fetchProduct, cleanContent } from './api';
import type { Advert } from './types';
import { PriceBlock } from './components/PriceBlock';
import { TechSpecs } from './components/TechSpecs';
import { SellersList } from './components/SellersList';
import { ReviewsBlock } from './components/ReviewsBlock';

const AVAILABLE_PRODUCTS = [
  { id: "10735101964", label: "Écran MSI", keyword: "MSI" },
  { id: "11084451963", label: "Matelas Emma", keyword: "Matelas" },
  { id: "7758205598", label: "Samsung Galaxy", keyword: "Galaxy" },
  { id: "13060247469", label: "CD Gaming", keyword: "FC" }
];

function App() {
  const [selectedId, setSelectedId] = useState(AVAILABLE_PRODUCTS[0].id);

  // UX : Je crée une référence pour pouvoir scroller automatiquement vers les avis
  const reviewsRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', selectedId],
    queryFn: () => fetchProduct(selectedId),
  });

  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);

  useEffect(() => {
    if (product && product.adverts && product.adverts.length > 0) {
      setSelectedAdvert(product.adverts[0]);
    } else {
      setSelectedAdvert(null);
    }
  }, [product]);

  const handleVariantClick = (newId: number) => {
    setSelectedId(newId.toString());
  };

  const handleSelectSeller = (advert: Advert) => {
    setSelectedAdvert(advert);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fonction pour scroller vers la section avis quand on clique sur avis
  const handleScrollToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentSelection = AVAILABLE_PRODUCTS.find(p => p.id === selectedId);

  const isProductValid = product && currentSelection
    ? product.headline.toLowerCase().includes(currentSelection.keyword.toLowerCase())
    : true;

  return (
    <Box sx={{ bgcolor: '#fbfbfb', minHeight: '100vh', pb: 8 }}>

      {/* --- HEADER --- */}
      <AppBar position="sticky" color="primary" elevation={0} sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Rakuten Test
          </Typography>
          <Select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value as string)}
            size="small"
            sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' }, '& .MuiSvgIcon-root': { color: 'white' } }}
          >
            {AVAILABLE_PRODUCTS.map((prod) => (
              <MenuItem key={prod.id} value={prod.id}>{prod.label}</MenuItem>
            ))}
          </Select>
        </Toolbar>
      </AppBar>

      {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>}

      {((!isLoading && isError) || (!isLoading && product && !isProductValid)) && (
        <ProductNotFound />
      )}

      {product && !isLoading && !isError && isProductValid && (
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 5 } }}>

          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
            <Link underline="hover" color="inherit" href="#">Accueil</Link>
            {product.breadcrumbs?.map((crumb, idx) => (
              <Link key={idx} underline="hover" color="inherit" href="#">{crumb.label}</Link>
            )) || <Typography>Produit</Typography>}
          </Breadcrumbs>

          {/* === ZONE HAUTE : IMAGE + PRIX === */}
          <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 2, bgcolor: 'white' }}>
            <Grid container spacing={6} alignItems="flex-start" sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>

              <Grid item xs={12} md={7} sx={{ position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '400px' }}>
                  <img
                    src={product.imagesUrls?.[0]}
                    alt={product.headline}
                    loading="lazy"
                    style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box maxWidth='1200px' max sx={{ position: { md: 'sticky' }, top: '100px' }}>

                  <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom sx={{ lineHeight: 1.3 }}>
                    {product.headline}
                  </Typography>

                  {/* NOTE GLOBALE : J'ai ajouté le onClick ici pour déclencher le scroll */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Rating value={product.globalRating?.score || 0} readOnly precision={0.5} size="small" />
                    <Typography
                      variant="body2"
                      sx={{ ml: 1, color: 'text.secondary', textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={handleScrollToReviews}
                    >
                      ({product.globalRating?.nbReviews || 0} avis)
                    </Typography>
                  </Box>

                  {product.declinationGroupsFromMFP && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Variantes :</Typography>
                      <Stack direction="row" spacing={1} useFlexGap sx={{ gap: 1 }}>
                        {product.declinationGroupsFromMFP.groups.map((group) => {
                          const variantId = group.groupProducts[0].id;
                          const isSelected = variantId.toString() === selectedId.toString();
                          return (
                            <Chip
                              key={variantId}
                              label={group.groupKeyValue}
                              clickable
                              onClick={() => handleVariantClick(variantId)}
                              color={isSelected ? "primary" : "default"}
                              variant={isSelected ? "filled" : "outlined"}
                            />
                          );
                        })}
                      </Stack>
                    </Box>
                  )}

                  <PriceBlock product={product} selectedAdvert={selectedAdvert} />

                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* === ZONE SECONDAIRE === */}
          <SellersList product={product} onSelectAdvert={handleSelectSeller} />

          {/* J'ai remonté le bloc Avis ici et je lui ai mis la "ref" pour que le scroll sache où s'arrêter */}
          <Box ref={reviewsRef} sx={{ scrollMarginTop: '100px' }}>
            <ReviewsBlock product={product} />
          </Box>

          {/* Description et Specs arrivent maintenant après les avis */}
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>Description</Typography>
                <Box
                  sx={{ typography: 'body1', color: 'text.secondary', lineHeight: 1.8, '& img': { maxWidth: '100%', height: 'auto', borderRadius: 2, my: 2 } }}
                  dangerouslySetInnerHTML={{
                    __html: cleanContent(product.edito || product.description || "Pas de description.")
                  }}
                />
                <Box sx={{ mt: 6 }}>
                  <TechSpecs product={product} />
                </Box>
              </Paper>
            </Grid>
          </Grid>

        </Container>
      )}
    </Box>
  );
}

const ProductNotFound = () => (
  <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
    <Paper elevation={0} sx={{ p: 5, borderRadius: 2, bgcolor: '#f5f5f5', border: '1px dashed #ccc' }}>
      <SearchOffIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Produit introuvable
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Désolé, le produit que vous cherchez n'est plus disponible ou l'URL est incorrecte.
      </Typography>
      <Button variant="contained" color="primary" href="/">
        Retour à l'accueil
      </Button>
    </Paper>
  </Container>
);

export default App;