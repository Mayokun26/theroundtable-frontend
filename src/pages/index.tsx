import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  CircularProgress 
} from '@mui/material';
import CharacterGrid from '../components/CharacterGrid';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        // Try to load characters from API if available
        try {
          const charactersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/characters`);
          if (charactersResponse.data.data) {
            setCharacters(charactersResponse.data.data);
          }
        } catch (error) {
          console.error('Using fallback characters');
          // We'll use the fallback characters from CharacterGrid component
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadCharacters();
  }, []);
  
  const handleStartConversation = () => {
    router.push('/conversation');
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
              sx={{ 
                bgcolor: '#8B4513', 
                '&:hover': { bgcolor: '#6b3311' } 
              }}
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
            <Typography variant="h4" component="h2" gutterBottom textAlign="center">
              Available Historical Figures
            </Typography>
            <CharacterGrid characters={characters} />
          </>
        )}
      </Container>
    </>
  );
} 