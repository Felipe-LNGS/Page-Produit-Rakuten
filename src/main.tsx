import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// J'initialise le client React Query qui va gérer le cache et les requêtes API dans toute l'app
const queryClient = new QueryClient();

// Je personnalise le thème Material UI pour coller à l'identité visuelle de Rakuten (Rouge #BF0000)
// et pour adoucir le design par défaut (border-radius, suppression des majuscules sur les boutons).
const theme = createTheme({
  palette: {
    primary: {
      main: '#BF0000',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Boutons un peu plus arrondis que le standard carré de MUI
          textTransform: 'none', // Je garde la casse naturelle du texte (pas de TOUT MAJUSCULE)
        }
      }
    }
  }
});

// Je wrap l'application avec les providers essentiels :
// 1. QueryClientProvider : Pour que useQuery fonctionne partout
// 2. ThemeProvider : Pour appliquer mes couleurs
// 3. CssBaseline : Pour normaliser le CSS (reset) sur tous les navigateurs
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)