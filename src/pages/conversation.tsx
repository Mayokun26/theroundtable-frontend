import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Checkbox, 
  FormControlLabel,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConversationPanel from '../components/ConversationPanel';
import Head from 'next/head';
import { useRouter } from 'next/router';

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

const ConversationPage: React.FC = () => {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [panelConfirmed, setPanelConfirmed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'system-1',
      content: 'Welcome to The Round Table! Select your panelists and click "Confirm Panel" to start a conversation.',
      sender: 'character',
      character: { id: 'system', name: 'System' },
      timestamp: new Date().toISOString()
    }
  ]);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('/api/characters');
        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }
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

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacters(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      } else {
        return [...prev, characterId];
      }
    });
  };

  const handleConfirmPanel = () => {
    if (selectedCharacters.length === 0) {
      setError('Please select at least one character for your panel.');
      return;
    }

    setPanelConfirmed(true);
    setMessages(prev => [
      ...prev,
      {
        id: `system-${prev.length + 1}`,
        content: 'Your panel is ready! Ask a question to start the conversation.',
        sender: 'character',
        character: { id: 'system', name: 'System' },
        timestamp: new Date().toISOString()
      }
    ]);
    setError('');
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || selectedCharacters.length === 0) return;

    // Add user message to the conversation
    const userMessage: Message = {
      id: `user-${messages.length + 1}`,
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setSendingMessage(true);

    try {
      // Send the message to the API
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          characters: selectedCharacters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get responses');
      }

      const data = await response.json();

      // Add character responses to the conversation
      if (data.responses && data.responses.length > 0) {
        // Add a slight delay before showing responses to simulate thinking time
        setTimeout(() => {
          data.responses.forEach((resp: any, index: number) => {
            const characterResponse: Message = {
              id: `character-${messages.length + index + 2}`,
              content: resp.content,
              sender: 'character',
              character: { id: resp.id || selectedCharacters[index], name: resp.name },
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, characterResponse]);
          });
          setSendingMessage(false);
        }, 1000);
      } else {
        throw new Error('No responses received');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `system-error-${messages.length + 1}`,
          content: 'Sorry, there was an error getting responses from the panel. Please try again.',
          sender: 'character',
          character: { id: 'system', name: 'System' },
          timestamp: new Date().toISOString()
        }
      ]);
      setSendingMessage(false);
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
        <meta name="description" content="Have a conversation with historical figures, legendary characters, and fictional personalities." />
      </Head>

      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push('/')} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            The Round Table Conversation
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Left side - Character Selection */}
          <Grid item xs={12} md={4} lg={3}>
            <Box sx={{ position: 'sticky', top: '20px' }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Select Your Panel
              </Typography>
              {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
              <Typography variant="body2" gutterBottom color="text.secondary">
                Choose characters to join your conversation panel ({selectedCharacters.length} selected)
              </Typography>
              
              <Box sx={{ mt: 2, mb: 3 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  disabled={panelConfirmed}
                  onClick={handleConfirmPanel}
                  fullWidth
                >
                  {panelConfirmed ? 'Panel Confirmed' : 'Confirm Panel'}
                </Button>
              </Box>
              
              <Box sx={{ maxHeight: 'calc(100vh - 240px)', overflow: 'auto', pr: 1 }}>
                {characters.map(character => (
                  <Card 
                    key={character.id} 
                    sx={{ 
                      mb: 2, 
                      border: selectedCharacters.includes(character.id) ? 2 : 0,
                      borderColor: 'primary.main',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box display="flex" alignItems="center">
                        <Box 
                          component="img" 
                          src={character.imageUrl || '/images/placeholder.jpg'} 
                          alt={character.name}
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            borderRadius: '50%',
                            objectFit: 'cover',
                            mr: 2
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.jpg';
                          }}
                        />
                        <Box>
                          <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
                            {character.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {character.era} • {character.category}
                          </Typography>
                        </Box>
                        <Box sx={{ ml: 'auto' }}>
                          <Checkbox 
                            checked={selectedCharacters.includes(character.id)}
                            onChange={() => handleCharacterSelect(character.id)}
                            disabled={panelConfirmed}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Grid>
          
          {/* Right side - Conversation */}
          <Grid item xs={12} md={8} lg={9}>
            <Box sx={{ height: 'calc(100vh - 120px)' }}>
              <ConversationPanel 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                loading={sendingMessage}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ConversationPage; 