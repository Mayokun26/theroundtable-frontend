import React, { useState } from 'react';
import { Box, Grid, Card, CardMedia, CardContent, Typography, Container, Chip, CircularProgress } from '@mui/material';

interface Character {
  id: string;
  name: string;
  category?: string;
  era?: string;
  description?: string;
  traits?: string[];
  imageUrl?: string;
}

interface CharacterGridProps {
  characters?: Character[];
}

const CharacterGrid: React.FC<CharacterGridProps> = ({ characters = [] }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Default characters if none provided
  const defaultCharacters: Character[] = [
    {
      id: '1',
      name: 'Socrates',
      category: 'Philosopher',
      era: 'Ancient Greece',
      description: 'Classical Greek philosopher credited as one of the founders of Western philosophy.',
      traits: ['Wisdom', 'Ethics', 'Logic'],
      imageUrl: '/images/characters/socrates.jpg'
    },
    {
      id: '2',
      name: 'Marie Curie',
      category: 'Scientist',
      era: 'Modern Era',
      description: 'Physicist and chemist who conducted pioneering research on radioactivity.',
      traits: ['Scientific', 'Dedicated', 'Pioneering'],
      imageUrl: '/images/characters/marie-curie.jpg'
    },
    {
      id: '3',
      name: 'Sun Tzu',
      category: 'Military Strategist',
      era: 'Ancient China',
      description: 'Chinese general, military strategist, writer, and philosopher known for "The Art of War".',
      traits: ['Strategic', 'Disciplined', 'Philosophical'],
      imageUrl: '/images/characters/sun-tzu.jpg'
    }
  ];

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

  // Use default characters if none provided
  const charactersToUse = characters && characters.length > 0 ? characters : defaultCharacters;
  
  // Always limit to exactly 3 characters
  const displayedCharacters = charactersToUse.slice(0, 3);

  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          The Round Table: Historical Figures
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="textSecondary" mb={6}>
          Engage with history's greatest minds
        </Typography>
        
        <Grid container spacing={3}>
          {displayedCharacters.map((character) => (
            <Grid item xs={12} sm={6} md={4} key={character.id}>
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