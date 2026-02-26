import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
} from '@mui/material';

const CONSENT_KEY = 'ai-data-consent-accepted';

export function hasAIConsent(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(CONSENT_KEY) === 'true';
}

export default function AIConsentDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasAIConsent()) {
      setOpen(true);
    }
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, 'true');
    setOpen(false);
  }, []);

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      aria-labelledby="ai-consent-title"
      PaperProps={{
        sx: {
          maxWidth: 480,
          borderRadius: 3,
          border: '1px solid rgba(111, 68, 39, 0.25)',
        },
      }}
    >
      <DialogTitle
        id="ai-consent-title"
        sx={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: '1.4rem', pb: 0.5 }}
      >
        How Your Data Is Used
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The Round Table uses a third-party AI service to generate character
          responses during conversations.
        </Typography>

        <Box
          component="ul"
          sx={{ pl: 2.5, mb: 2, '& li': { mb: 1 }, '& li::marker': { color: 'primary.main' } }}
        >
          <li>
            <Typography variant="body2">
              <strong>What is sent:</strong> The messages you type and recent
              conversation context are transmitted to generate responses.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Who receives it:</strong> Your messages are processed by{' '}
              <Link href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer">
                OpenAI
              </Link>
              , a third-party AI provider.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>No personal accounts or tracking:</strong> We do not
              collect your name, email, or any personally identifiable
              information. No analytics or tracking SDKs are used.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Session-only storage:</strong> Conversation data is
              discarded when your session ends. Nothing is stored permanently.
            </Typography>
          </li>
        </Box>

        <Typography variant="body2" color="text.secondary">
          By continuing, you agree to this data handling. Read our full{' '}
          <Link href="/legal/privacy-policy.html" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </Link>{' '}
          for more details.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="contained" color="primary" onClick={handleAccept} fullWidth>
          I Understand and Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}
