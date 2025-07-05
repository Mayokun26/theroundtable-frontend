import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { Box, Button, Typography, Container, Grid, CircularProgress } from '@mui/material';
import CharacterGrid from '../components/CharacterGrid';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characters, setCharacters] = useState([]);
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  
  useEffect(() => {
    const checkApiAndLoadCharacters = async () => {
      try {
        // Check API health with timeout to prevent long waits
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          const healthResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (healthResponse.status === 200) {
            setApiStatus('connected');
            
            // Load characters
            try {
              const charactersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/characters`);
              setCharacters(charactersResponse.data.data);
            } catch (charactersError) {
              console.error('Failed to load characters:', charactersError);
              // Don't set error state here, we'll still show the UI with fallback characters
            }
          }
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      } catch (err) {
        console.error('API connection error:', err);
        setApiStatus('error');
        // Don't set error to ensure fallback UI is shown despite API error
        // setError('Failed to connect to the API server. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    
    checkApiAndLoadCharacters();
  }, []);
  
  const handleStartConversation = () => {
    router.push('/conversation');
  };
  
  const checkApiConnection = () => {
    alert('API Connection: ' + (process.env.NEXT_PUBLIC_API_URL || 'Not configured'));
  };
  
  return (
    <>
      <Head>
        <title>The Round Table | Historical Conversations</title>
        <meta name="description" content="Engage in thought-provoking conversations with historical figures powered by AI" />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" component="h1" gutterBottom>
            The Round Table
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Welcome to The Round Table, a platform for engaging discussions with historical figures.
          </Typography>
          <Box mt={4}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={handleStartConversation}
            >
              Start a Conversation
            </Button>
          </Box>
        </Box>
          {loading ? (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {error && (
              <Box 
                sx={{ 
                  p: 3, 
                  mb: 4,
                  bgcolor: 'error.main', 
                  color: 'white',
                  borderRadius: 1,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h6">{error}</Typography>
                <Typography variant="body2" mt={1}>
                  Please make sure the backend server is running and accessible.
                </Typography>
              </Box>
            )}
            
            <Typography variant="h4" component="h2" gutterBottom mt={8} textAlign="center">
              {apiStatus === 'connected' ? 'Available Historical Figures' : 'Sample Historical Figures'}
            </Typography>
            
            {apiStatus === 'error' && (
              <Typography variant="body1" textAlign="center" mb={4} color="text.secondary">
                The API is currently unavailable. Showing sample characters for demonstration purposes.
              </Typography>
            )}
            
            <CharacterGrid characters={characters} />
          </>
        )}
      </Container>
    </>
  );
} 