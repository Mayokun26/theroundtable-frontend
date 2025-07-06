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
import conversationStyles from '@/styles/conversationStyles';
// Dynamic import for the warmup utility to avoid server-side issues
import dynamic from 'next/dynamic';

// Load the warmup utility function directly (not as a component)
const warmupLambda = async () => {
  // Only import in client-side
  if (typeof window !== 'undefined') {
    try {
      const module = await import('../utils/warmup-lambda');
      return await module.warmupLambda();
    } catch (err) {
      console.error('Error importing warmup utility:', err);
      return false;
    }
  }
  return false;
};

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

const ConversationPage = () => {
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
  const [sendingMessage, setSendingMessage] = useState(false);  // State to track Lambda warmup status
  const [lambdaWarmedUp, setLambdaWarmedUp] = useState(false);
  
  // Add a warmup effect to pre-warm the Lambda function
  useEffect(() => {
    // Warm up the Lambda function when the page loads
    const warmupFunction = async () => {
      try {
        console.log('Warming up Lambda function...');
        const success = await warmupLambda();
        console.log('Lambda warmup completed, success:', success);
        setLambdaWarmedUp(success);
      } catch (err) {
        console.error('Error warming up Lambda:', err);
        setLambdaWarmedUp(false);
      }
    };
    
    warmupFunction();
    
    // Set a timer to retry warmup after 10 seconds if it failed or never completed
    const retryTimer = setTimeout(() => {
      if (!lambdaWarmedUp) {
        console.log('Retrying Lambda warmup...');
        warmupFunction();
      }
    }, 10000);
    
    return () => clearTimeout(retryTimer);
  }, [lambdaWarmedUp]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        // Try to get pre-selected characters from URL query params
        if (router.query.characters) {
          const characterIds = Array.isArray(router.query.characters)
            ? router.query.characters
            : [router.query.characters];
          setSelectedCharacters(characterIds);
        }
        
        // Fetch characters from API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/characters`);
        if (!response.ok) {
          throw new Error(`Failed to fetch characters: ${response.statusText}`);
        }
        
        const data = await response.json();
        const charactersArray = data.data || [];
        setCharacters(charactersArray);
        setLoading(false);
      } catch (err) {
        setError('Error loading characters. Please try again later.');
        setLoading(false);
        console.error('Error fetching characters:', err);
      }
    };

    fetchCharacters();
  }, [router.query]);

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacters(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      } else {
        // Limit to a maximum of 3 characters
        if (prev.length >= 3) {
          // If already at 3 characters, show error
          setError('Maximum of 3 characters allowed in your panel.');
          return prev;
        }
        return [...prev, characterId];
      }
    });
  };
  const handleConfirmPanel = () => {
    if (selectedCharacters.length === 0) {
      setError('Please select at least one character for your panel.');
      return;
    }

    try {
      // Set panel as confirmed
      setPanelConfirmed(true);
      
      // Clear any existing errors
      setError('');
      
      // Add a confirmation message
      setMessages(prev => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          content: 'Your panel is ready! Ask a question to start the conversation.',
          sender: 'character',
          character: { id: 'system', name: 'System' },
          timestamp: new Date().toISOString()
        }
      ]);
      
      // Log for debugging
      console.log('Panel confirmed with characters:', selectedCharacters);
    } catch (err) {
      console.error('Error confirming panel:', err);
      setError('There was an error setting up your panel. Please try again.');
    }
  };  const handleSendMessage = async (message: string) => {
    if (!message.trim() || selectedCharacters.length === 0 || !panelConfirmed) {
      if (!panelConfirmed) {
        setError('Please confirm your panel before sending a message.');
      }
      return;
    }

    // Add user message to the conversation
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setSendingMessage(true);
    setError(''); // Clear any existing errors
    
    try {
      // Log request details for debugging
      console.log(`Sending message to API: ${process.env.NEXT_PUBLIC_API_URL}/conversations`);
        // First try to warm up the Lambda if it's the first message
      if (messages.filter(m => m.sender === 'user').length <= 1) {
        try {
          console.log('Warming up Lambda before first message...');
          await warmupLambda();
          // Small delay after warmup to ensure Lambda is ready
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err) {
          console.log('Warmup attempt before sending message failed (non-critical):', err);
        }
      }
      
      // Send the message to our backend API with improved error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout (increased from 10s)
      
      // Add a loading message first to improve user experience
      const loadingMessage: Message = {
        id: `system-loading-${Date.now()}`,
        content: "Thinking...",
        sender: 'character',
        character: { id: 'system', name: 'System' },
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, loadingMessage]);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message,
          characters: selectedCharacters
        })
      });
      
      // Clear timeout regardless of response
      clearTimeout(timeoutId);
      
      // Remove the loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        
        // Try to get more error details from the response
        let errorDetails = '';
        try {
          const errorData = await response.json();
          errorDetails = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          // Ignore if we can't parse the error response
        }
        
        throw new Error(`Failed to get responses: ${response.status} ${response.statusText}${errorDetails ? ` - ${errorDetails}` : ''}`);
      }

      const data = await response.json();
      console.log('Response received:', data);

      // Add character responses to the conversation
      if (data.data && data.data.responses && data.data.responses.length > 0) {
        // Add a slight delay before showing responses to simulate thinking time
        setTimeout(() => {
          // Process each response sequentially with a small delay between them
          const addResponses = async () => {
            for (const resp of data.data.responses) {
              const characterResponse: Message = {
                id: resp.id || `character-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                content: resp.content,
                sender: 'character',
                character: { 
                  id: resp.characterId, 
                  name: resp.name 
                },
                timestamp: resp.timestamp || new Date().toISOString()
              };
              
              setMessages(prev => [...prev, characterResponse]);
              // Small delay between character responses
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            setSendingMessage(false);
          };
          
          addResponses();
        }, 1000);
      } else {
        throw new Error('No responses received from API');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setSendingMessage(false);
      setMessages(prev => [
        ...prev,
        {
          id: `system-error-${Date.now()}`,
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
                Choose up to 3 characters to join your conversation panel ({selectedCharacters.length}/3 selected)
              </Typography>
              
              <Box sx={{ mt: 2, mb: 3 }}>                <Button 
                  variant="contained" 
                  color="primary"
                  disabled={panelConfirmed || selectedCharacters.length === 0}
                  onClick={handleConfirmPanel}
                  fullWidth
                  sx={{ 
                    py: 1.5, 
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }}
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