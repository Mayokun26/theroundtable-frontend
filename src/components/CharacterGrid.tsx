import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Container, Chip, CircularProgress } from '@mui/material';

interface Character {
  id: string;
  name: string;
  category: string;
  era: string;
  description: string;
  traits: string[];
  imageUrl: string;
}

const CharacterGrid: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('/api/characters');
        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }
        // The API returns an array directly, not an object with a characters property
        const data = await response.json();
        setCharacters(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError('Error loading characters. Please try again later.');
        setLoading(false);
        console.error('Error fetching characters:', err);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  // If there are no characters and no error, show a message instead of throwing an error
  if (!characters || characters.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography variant="h6">No characters found. Please try again later.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          The Round Table: 50 Historical and Legendary Panelists
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="textSecondary" mb={6}>
          Engage with history's greatest minds, legendary heroes, and fictional characters
        </Typography>
        
        <Grid container spacing={3}>
          {characters.map((character) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={character.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={character.imageUrl || '/images/placeholder.jpg'}
                  alt={character.name}
                  sx={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.jpg';
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {character.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {character.era || 'Unknown era'} • {character.category || 'Uncategorized'}
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ mb: 2 }}>
                    {character.description || 'No description available.'}
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {(character.traits || []).map((trait) => (
                      <Chip
                        key={trait}
                        label={trait}
                        size="small"
                        variant="outlined"
                        sx={{ marginBottom: 0.5 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CharacterGrid; 