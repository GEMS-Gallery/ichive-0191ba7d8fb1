import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, CircularProgress, Snackbar } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './components/Home';
import CategoryView from './components/CategoryView';
import ThreadView from './components/ThreadView';
import NewThreadForm from './components/NewThreadForm';
import { backend } from '../declarations/backend';
import { retryAsync } from './utils/retryAsync';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
    },
    secondary: {
      main: '#2ecc71',
    },
    error: {
      main: '#e74c3c',
    },
  },
});

function App() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await retryAsync(() => backend.initialize(), 3);
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize:', error);
        setError('Failed to initialize the application. Please try again.');
      }
    };
    init();
  }, []);

  if (!initialized) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            IC Forum
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<CategoryView />} />
          <Route path="/thread/:id" element={<ThreadView />} />
          <Route path="/new-thread" element={<NewThreadForm />} />
        </Routes>
      </Container>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </ThemeProvider>
  );
}

export default App;
