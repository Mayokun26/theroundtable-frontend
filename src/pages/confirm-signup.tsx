import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import { useAuth } from '@/providers/AuthProvider';

export default function ConfirmSignUp() {
  const router = useRouter();
  const { confirmSignUp, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    try {
      await confirmSignUp(email, code);
      setIsConfirmed(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to confirm signup');
    }
  };

  if (isConfirmed) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography component="h1" variant="h5">
              Email Confirmed!
            </Typography>
            <Typography sx={{ mt: 2, textAlign: 'center' }}>
              Your email has been confirmed. You will be redirected to the login page in a few seconds...
            </Typography>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              sx={{ mt: 3 }}
            >
              Go to Login
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Confirm Your Email
          </Typography>

          {(error || localError) && (
            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
              {error || localError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="code"
              label="Confirmation Code"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Confirm Email'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Didn't receive the code?{' '}
                <Link href="/resend-code" passHref>
                  <Typography
                    component="a"
                    variant="body2"
                    sx={{ textDecoration: 'none', color: 'primary.main' }}
                  >
                    Resend Code
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 