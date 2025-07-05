import React from 'react';
import { 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  CardActions,
  Button
} from '@mui/material';
import { useRouter } from 'next/router';

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
  characters: Character[];
}

const CharacterGrid: React.FC<CharacterGridProps> = ({ characters = [] }) => {
  const router = useRouter();
  
  const characterList = React.useMemo(() => {
    if (characters.length === 0) {
      // If no characters provided, render default characters (limited to 3)
      return [
        {
          id: '1',
          name: 'Socrates',
          category: 'Philosopher',
          era: 'Ancient Greece',
          description: 'Classical Greek philosopher credited as one of the founders of Western philosophy.',
          traits: ['Wisdom', 'Ethics', 'Logic'],
          imageUrl: '/images/socrates.jpg'
        },
        {
          id: '2',
          name: 'Marie Curie',
          category: 'Scientist',
          era: 'Modern Era',
          description: 'Physicist and chemist who conducted pioneering research on radioactivity.',
          traits: ['Scientific', 'Dedicated', 'Pioneering'],
          imageUrl: '/images/marie-curie.jpg'
        },
        {
          id: '3',
          name: 'Sun Tzu',
          category: 'Military Strategist',
          era: 'Ancient China',
          description: 'Chinese general, military strategist, writer, and philosopher known for "The Art of War".',
          traits: ['Strategic', 'Disciplined', 'Philosophical'],
          imageUrl: '/images/sun-tzu.jpg'
        }
      ];
    }
    // Limit to only 3 characters
    return characters.slice(0, 3);
  }, [characters]);

  const handleStartConversation = (characterId: string) => {
    router.push(`/conversation?characters=${characterId}`);
  };

  return (
    <Grid container spacing={3}>
      {characterList.map((character) => (
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
            <CardActions>
              <Button 
                size="small" 
                onClick={() => handleStartConversation(character.id)}
                variant="contained" 
                fullWidth
              >
                Converse
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CharacterGrid;
