import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import historicalTheme from '@/theme/historicalTheme';
import AIConsentDialog from '@/components/AIConsentDialog';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={historicalTheme}>
        <CssBaseline />
        <AIConsentDialog />
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
