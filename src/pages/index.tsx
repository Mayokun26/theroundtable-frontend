import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from 'axios';
import { Box, Button, CircularProgress, Container, Link, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import CharacterGrid from '../components/CharacterGrid';

const revealUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const revealFade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characters, setCharacters] = useState([]);
  const [apiStatus, setApiStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    const checkApiAndLoadCharacters = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        try {
          const healthResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (healthResponse.status === 200) {
            setApiStatus('connected');

            try {
              const charactersResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/characters`);
              setCharacters(charactersResponse.data.data);
            } catch (charactersError) {
              console.error('Failed to load characters:', charactersError);
            }
          }
        } catch (requestError) {
          clearTimeout(timeoutId);
          throw requestError;
        }
      } catch (err) {
        console.error('API connection error:', err);
        setApiStatus('error');
        setError('Could not reach the archive service right now.');
      } finally {
        setLoading(false);
      }
    };

    checkApiAndLoadCharacters();
  }, []);

  const handleStartConversation = () => {
    router.push('/conversation');
  };

  return (
    <>
      <Head>
        <title>The Round Table | Historical Conversations</title>
        <meta
          name="description"
          content="Enter a richly styled salon and engage in thought-provoking conversations with historical figures."
        />
      </Head>

      <Container maxWidth="lg" sx={{ py: { xs: 2.25, sm: 3, md: 7 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 2.5, md: 5 },
            border: '1px solid',
            borderColor: 'rgba(112, 74, 43, 0.28)',
            backgroundImage:
              'linear-gradient(135deg, rgba(33, 30, 24, 0.75), rgba(72, 48, 31, 0.66)), url("/images/parchment-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 26px 45px rgba(27, 18, 10, 0.24)',
            px: { xs: 2, sm: 3.25, md: 7 },
            py: { xs: 3.25, sm: 4.2, md: 9 },
            mb: { xs: 3.25, md: 6 },
            animation: `${revealFade} 420ms ease-out both`,
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 14% 18%, rgba(240, 216, 173, 0.3), transparent 52%), radial-gradient(circle at 85% 75%, rgba(196, 151, 89, 0.2), transparent 46%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Stack spacing={{ xs: 1.35, md: 2.5 }} sx={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
            <Typography
              variant="overline"
              sx={{
                color: '#f4dfbc',
                letterSpacing: { xs: 1.6, md: 2.6 },
                fontWeight: 700,
                animation: `${revealUp} 420ms ease-out both`,
                animationDelay: '80ms',
              }}
            >
              LIVE HISTORICAL DEBATES
            </Typography>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                color: '#fff2de',
                lineHeight: 1,
                fontSize: { xs: '2.05rem', sm: '2.55rem', md: '4rem' },
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.34)',
                animation: `${revealUp} 420ms ease-out both`,
                animationDelay: '140ms',
              }}
            >
              The Round Table
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#f6ebda',
                maxWidth: 620,
                fontSize: { xs: '0.98rem', sm: '1.08rem', md: '1.35rem' },
                animation: `${revealUp} 420ms ease-out both`,
                animationDelay: '210ms',
              }}
            >
              Convene philosophers, scientists, and strategists in one chamber and explore how great minds challenge one another.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 1.5 }}
              sx={{ pt: { xs: 0.5, md: 1.5 }, animation: `${revealUp} 420ms ease-out both`, animationDelay: '290ms' }}
            >
              <Button variant="contained" size="large" onClick={handleStartConversation} sx={{ minWidth: { xs: '100%', sm: 220 } }}>
                Enter the Chamber
              </Button>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: { xs: 1.6, md: 2 },
                  py: 0.9,
                  borderRadius: 20,
                  border: '1px solid rgba(250, 236, 208, 0.45)',
                  bgcolor: 'rgba(14, 11, 8, 0.24)',
                }}
              >
                <Typography variant="body2" sx={{ color: '#f4e4c6', fontWeight: 600, fontSize: { xs: '0.78rem', md: '0.86rem' } }}>
                  {apiStatus === 'connected' ? 'Archive Connected' : 'Archive Preview Mode'}
                </Typography>
              </Box>
            </Stack>
          </Stack>
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
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6">{error}</Typography>
                <Typography variant="body2" mt={1}>
                  Please make sure the backend server is running and accessible.
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                mb: { xs: 1.5, md: 3 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'flex-end' },
                flexDirection: { xs: 'column', md: 'row' },
                gap: 1,
                animation: `${revealFade} 460ms ease-out both`,
              }}
            >
              <Typography variant="h3" component="h2" sx={{ color: 'text.primary', fontSize: { xs: '1.55rem', sm: '1.9rem', md: '2.65rem' } }}>
                {apiStatus === 'connected' ? 'Voices at the Table' : 'Featured Historical Voices'}
              </Typography>
              {apiStatus === 'error' && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Live archive unavailable. Showing curated exemplars.
                </Typography>
              )}
            </Box>

            <CharacterGrid characters={characters} />
          </>
        )}

        <Box
          component="footer"
          sx={{
            mt: { xs: 3, md: 5 },
            pt: 2,
            pb: 1,
            borderTop: '1px solid rgba(112, 74, 43, 0.15)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
            Your conversations are processed by OpenAI.{' '}
            <Link href="/legal/privacy-policy.html" target="_blank" rel="noopener noreferrer" color="primary">
              Privacy Policy
            </Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
}
