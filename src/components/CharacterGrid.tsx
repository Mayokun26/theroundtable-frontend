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
  Button,
} from '@mui/material';
import { keyframes } from '@mui/system';
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

const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CharacterGrid: React.FC<CharacterGridProps> = ({ characters = [] }) => {
  const router = useRouter();

  const characterList = React.useMemo(() => {
    if (characters.length === 0) {
      return [
        {
          id: '1',
          name: 'Socrates',
          category: 'Philosopher',
          era: 'Ancient Greece',
          description: 'Classical Greek philosopher credited as one of the founders of Western philosophy.',
          traits: ['Wisdom', 'Ethics', 'Logic'],
          imageUrl: '/images/socrates.jpg',
        },
        {
          id: '2',
          name: 'Marie Curie',
          category: 'Scientist',
          era: 'Modern Era',
          description: 'Physicist and chemist who conducted pioneering research on radioactivity.',
          traits: ['Scientific', 'Dedicated', 'Pioneering'],
          imageUrl: '/images/marie-curie.jpg',
        },
        {
          id: '3',
          name: 'Sun Tzu',
          category: 'Military Strategist',
          era: 'Ancient China',
          description: 'Chinese general, military strategist, writer, and philosopher known for "The Art of War".',
          traits: ['Strategic', 'Disciplined', 'Philosophical'],
          imageUrl: '/images/sun-tzu.jpg',
        },
      ];
    }
    return characters.slice(0, 3);
  }, [characters]);

  const handleStartConversation = (characterId: string) => {
    router.push(`/conversation?characters=${characterId}`);
  };

  return (
    <Grid container spacing={{ xs: 2, md: 3.5 }}>
      {characterList.map((character, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={character.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(160deg, #fdf5e7 0%, #f3e6cd 100%)',
              border: '1px solid rgba(112, 74, 43, 0.26)',
              overflow: 'hidden',
              transition: 'transform 220ms ease, box-shadow 220ms ease',
              animation: `${riseIn} 430ms ease both`,
              animationDelay: `${Math.min(index * 95, 360)}ms`,
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 16px 28px rgba(51, 35, 23, 0.2)',
              },
            }}
          >
            <Box sx={{ px: { xs: 1.5, md: 2.2 }, pt: { xs: 1.5, md: 2.2 } }}>
              <CardMedia
                component="img"
                height="220"
                image={character.imageUrl || '/images/placeholder.jpg'}
                alt={character.name}
                sx={{
                  objectFit: 'cover',
                  borderRadius: 1.5,
                  border: '2px solid rgba(112, 74, 43, 0.2)',
                  filter: 'saturate(0.88) contrast(1.05)',
                  height: { xs: 186, sm: 200, md: 220 },
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder.jpg';
                }}
              />
            </Box>

            <CardContent sx={{ flexGrow: 1, pt: { xs: 1.5, md: 2.2 }, px: { xs: 1.5, md: 2.2 } }}>
              <Typography gutterBottom variant="h4" component="h3" sx={{ fontSize: { xs: '1.34rem', md: '1.6rem' }, lineHeight: 1.05 }}>
                {character.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  letterSpacing: 0.3,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', md: '0.75rem' },
                  mb: 1.1,
                }}
              >
                {character.era || 'Unknown era'} | {character.category || 'Uncategorized'}
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  mb: { xs: 1.4, md: 2.2 },
                  minHeight: { xs: 'unset', md: 72 },
                  fontSize: { xs: '0.95rem', md: '1.06rem' },
                }}
              >
                {character.description || 'No description available.'}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={0.8}>
                {(character.traits || []).map((trait) => (
                  <Chip
                    key={trait}
                    label={trait}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(112, 74, 43, 0.09)',
                      border: '1px solid rgba(112, 74, 43, 0.2)',
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Box>
            </CardContent>
            <CardActions sx={{ p: { xs: 1.5, md: 2.2 }, pt: { xs: 0.7, md: 0.8 } }}>
              <Button size="large" onClick={() => handleStartConversation(character.id)} variant="contained" fullWidth>
                Invite to Panel
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CharacterGrid;
