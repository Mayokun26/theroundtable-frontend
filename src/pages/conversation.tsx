import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  AppBar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { keyframes } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ConversationPanel from '../components/ConversationPanel';

const warmupLambda = async () => {
  if (typeof window !== 'undefined') {
    try {
      const warmupModule = await import('../utils/warmup-lambda');
      return await warmupModule.warmupLambda();
    } catch (err) {
      console.error('Error importing warmup utility:', err);
      return false;
    }
  }
  return false;
};

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface Character {
  id: string;
  name: string;
  category: string;
  era: string;
  description: string;
  traits: string[];
  imageUrl: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'character';
  character?: {
    id: string;
    name: string;
  };
  timestamp: string;
}

interface ApiConversationResponse {
  id: string;
  name: string;
  content: string;
  timestamp: string;
}

const fallbackCharacters: Character[] = [
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

const ConversationPage = () => {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [panelConfirmed, setPanelConfirmed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [lambdaWarmedUp, setLambdaWarmedUp] = useState(false);
  const availableCharacters = characters.length > 0 ? characters : fallbackCharacters;

  useEffect(() => {
    const warmupFunction = async () => {
      try {
        const success = await warmupLambda();
        setLambdaWarmedUp(success);
      } catch (err) {
        console.error('Error warming up Lambda:', err);
        setLambdaWarmedUp(false);
      }
    };

    warmupFunction();

    const retryTimer = setTimeout(() => {
      if (!lambdaWarmedUp) {
        warmupFunction();
      }
    }, 10000);

    return () => clearTimeout(retryTimer);
  }, [lambdaWarmedUp]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        if (router.query.characters) {
          const characterIds = Array.isArray(router.query.characters)
            ? router.query.characters
            : [router.query.characters];
          setSelectedCharacters(characterIds);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/characters`);
        if (!response.ok) {
          throw new Error(`Failed to fetch characters: ${response.statusText}`);
        }

        const data = await response.json();
        const loadedCharacters = Array.isArray(data.data) ? data.data : [];
        setCharacters(loadedCharacters.length > 0 ? loadedCharacters : fallbackCharacters);
        setLoading(false);
      } catch (err) {
        setError('Live panelists are unavailable. Showing sample panelists.');
        setCharacters(fallbackCharacters);
        setLoading(false);
        console.error('Error fetching characters:', err);
      }
    };

    fetchCharacters();
  }, [router.query]);

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacters((prev) => {
      if (prev.includes(characterId)) {
        return prev.filter((id) => id !== characterId);
      }
      if (prev.length >= 3) {
        setError('Maximum of 3 characters allowed in your panel.');
        return prev;
      }
      return [...prev, characterId];
    });
  };

  const handleConfirmPanel = () => {
    if (selectedCharacters.length === 0) {
      setError('Please select at least one character for your panel.');
      return;
    }

    try {
      setPanelConfirmed(true);
      setError('');
    } catch (err) {
      console.error('Error confirming panel:', err);
      setError('There was an error setting up your panel. Please try again.');
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || selectedCharacters.length === 0 || !panelConfirmed) {
      if (!panelConfirmed) {
        setError('Please confirm your panel before sending a message.');
      }
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setSendingMessage(true);
    setError('');

    try {
      if (messages.filter((m) => m.sender === 'user').length <= 1) {
        try {
          await warmupLambda();
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
          console.log('Warmup attempt before sending message failed (non-critical):', err);
        }
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message,
          characters: selectedCharacters,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch {
          // noop
        }

        throw new Error(
          `Failed to get responses: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ''}`,
        );
      }

      const data = await response.json();
      const responsesRaw = Array.isArray(data.responses)
        ? data.responses
        : Array.isArray(data.data?.responses)
          ? data.data.responses
          : [];

      const responses: ApiConversationResponse[] = responsesRaw
        .map((resp: Record<string, unknown>) => ({
          id: (typeof resp.characterId === 'string' && resp.characterId) || (typeof resp.id === 'string' && resp.id) || `character-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name:
            (typeof resp.name === 'string' && resp.name) ||
            (typeof resp.characterName === 'string' && resp.characterName) ||
            'Panelist',
          content:
            (typeof resp.content === 'string' && resp.content.trim()) ||
            (typeof resp.message === 'string' && resp.message.trim()) ||
            '',
          timestamp: typeof resp.timestamp === 'string' ? resp.timestamp : new Date().toISOString(),
        }))
        .filter((resp: ApiConversationResponse) => resp.content.length > 0);

      if (responses.length > 0) {
        setTimeout(() => {
          const addResponses = async () => {
            for (const resp of responses) {
              const characterResponse: Message = {
                id: `msg-${resp.id}-${resp.timestamp}-${Math.random().toString(36).substring(2, 8)}`,
                content: resp.content,
                sender: 'character',
                character: {
                  id: resp.id,
                  name: resp.name,
                },
                timestamp: resp.timestamp,
              };

              setMessages((prev) => [...prev, characterResponse]);
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
            setSendingMessage(false);
          };

          addResponses();
        }, 1000);
      } else {
        const backendMessage = typeof data.message === 'string' ? data.message : '';
        throw new Error(backendMessage || 'No responses received from API');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setSendingMessage(false);
      const fallbackMessage = 'Unable to reach the conversation service right now. Please try again.';
      setError(err instanceof Error && err.message ? err.message : fallbackMessage);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Start a Conversation - The Round Table</title>
        <meta
          name="description"
          content="Assemble historical figures and host a focused, multi-voice roundtable conversation."
        />
      </Head>

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(130, 89, 57, 0.28)',
        }}
      >
        <Toolbar sx={{ py: { xs: 0.25, md: 0.5 } }}>
          <IconButton edge="start" color="inherit" onClick={() => router.push('/')} aria-label="back" sx={{ mr: 1.2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontSize: { xs: '1.15rem', md: '1.5rem' } }}>
            The Round Table Chamber
          </Typography>
          <Chip
            size="small"
            label={panelConfirmed ? 'Panel Confirmed' : `${selectedCharacters.length}/3 Selected`}
            color={panelConfirmed ? 'secondary' : 'default'}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              fontWeight: 700,
              border: '1px solid rgba(255, 240, 212, 0.35)',
              bgcolor: panelConfirmed ? 'rgba(64, 98, 82, 0.82)' : 'rgba(44, 29, 18, 0.32)',
              color: '#f8ebd4',
            }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 2.5, md: 3.5 } }}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid item xs={12} md={4} lg={3}>
            <Box
              sx={{
                position: { xs: 'static', md: 'sticky' },
                top: { md: '82px' },
                borderRadius: 2.5,
                p: { xs: 2, md: 2.5 },
                background: 'linear-gradient(165deg, rgba(253, 245, 230, 0.92), rgba(244, 230, 206, 0.92))',
                border: '1px solid rgba(112, 74, 43, 0.2)',
                boxShadow: '0 10px 20px rgba(42, 27, 15, 0.12)',
                animation: `${fadeInUp} 380ms ease-out both`,
              }}
            >
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontSize: { xs: '1.5rem', md: '1.9rem' } }}>
                Assemble Your Panel
              </Typography>
              <Typography variant="body2" gutterBottom color="text.secondary" sx={{ mb: 1.3 }}>
                Choose up to three voices to join this session.
              </Typography>
              {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

              <Button
                variant="contained"
                color="primary"
                disabled={panelConfirmed || selectedCharacters.length === 0}
                onClick={handleConfirmPanel}
                fullWidth
                sx={{
                  py: { xs: 1.2, md: 1.35 },
                  mb: 2,
                  fontSize: { xs: '0.95rem', md: '1rem' },
                }}
              >
                {panelConfirmed ? 'Panel Confirmed' : 'Confirm Panel'}
              </Button>

              <Stack
                spacing={1.2}
                sx={{
                  maxHeight: { xs: 'none', md: 'calc(100vh - 275px)' },
                  overflowY: { xs: 'visible', md: 'auto' },
                  pr: { xs: 0, md: 0.4 },
                }}
              >
                {availableCharacters.map((character, index) => (
                  <Box
                    key={character.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => !panelConfirmed && handleCharacterSelect(character.id)}
                    onKeyDown={(event) => {
                      if (!panelConfirmed && (event.key === 'Enter' || event.key === ' ')) {
                        event.preventDefault();
                        handleCharacterSelect(character.id);
                      }
                    }}
                    sx={{
                      cursor: panelConfirmed ? 'default' : 'pointer',
                      border: selectedCharacters.includes(character.id)
                        ? '2px solid rgba(111, 68, 39, 0.8)'
                        : '1px solid rgba(111, 68, 39, 0.18)',
                      background: selectedCharacters.includes(character.id)
                        ? 'linear-gradient(160deg, #fff7e8, #f3e4cb)'
                        : 'linear-gradient(160deg, #fdf5e7, #f7ecd8)',
                      transition: 'transform 200ms ease, box-shadow 200ms ease',
                      animation: `${fadeInUp} 420ms ease both`,
                      animationDelay: `${Math.min(index * 65, 420)}ms`,
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 18px rgba(51, 35, 23, 0.16)',
                      },
                      borderRadius: 2,
                      px: { xs: 1.2, md: 1.4 },
                      py: { xs: 1, md: 1.2 },
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={character.imageUrl || '/images/placeholder.jpg'}
                        alt={character.name}
                        imgProps={{
                          onError: (e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.jpg';
                          },
                        }}
                        sx={{
                          width: { xs: 50, md: 56 },
                          height: { xs: 50, md: 56 },
                          mr: 1.3,
                          border: '2px solid rgba(111, 68, 39, 0.25)',
                        }}
                      />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" component="div" sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, lineHeight: 1.05 }}>
                          {character.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2 }}>
                          {character.era} | {character.category}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 'auto' }}>
                        <Checkbox
                          checked={selectedCharacters.includes(character.id)}
                          onChange={() => handleCharacterSelect(character.id)}
                          onClick={(event) => event.stopPropagation()}
                          disabled={panelConfirmed}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <Box
              sx={{
                height: { xs: '72vh', sm: '74vh', md: 'calc(100vh - 160px)' },
                minHeight: { xs: 480, md: 560 },
                animation: `${fadeInUp} 420ms ease-out both`,
              }}
            >
              <ConversationPanel messages={messages} onSendMessage={handleSendMessage} loading={sendingMessage} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ConversationPage;
