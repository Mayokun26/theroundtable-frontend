import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6F4427',
      light: '#8A5A39',
      dark: '#50311C',
      contrastText: '#FDF4E3',
    },
    secondary: {
      main: '#365245',
      light: '#4C6D5D',
      dark: '#23372E',
      contrastText: '#F1F7F3',
    },
    background: {
      default: '#EFE2CB',
      paper: '#FAF0DE',
    },
    text: {
      primary: '#2E2015',
      secondary: '#5E4534',
    },
    error: {
      main: '#B3342E',
    },
    warning: {
      main: '#B5671C',
    },
    info: {
      main: '#335E77',
    },
    success: {
      main: '#2D5A3D',
    },
  },
  typography: {
    fontFamily: "'Crimson Text', Georgia, serif",
    h1: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 700,
      letterSpacing: 0.3,
    },
    h2: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 600,
    },
    h4: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.08rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 700,
      letterSpacing: 0.5,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at 20% 10%, rgba(255, 243, 217, 0.52), transparent 40%), radial-gradient(circle at 80% 90%, rgba(183, 147, 98, 0.2), transparent 38%), #efe2cb',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: '0 10px 18px rgba(39, 25, 14, 0.12)',
          border: '1px solid rgba(111, 68, 39, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 18px',
          boxShadow: '0 4px 10px rgba(45, 29, 17, 0.14)',
          '&:hover': {
            boxShadow: '0 7px 15px rgba(45, 29, 17, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6F4427 0%, #8A5A39 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #2F473C 0%, #4C6D5D 100%)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #3F291A 0%, #654026 100%)',
          boxShadow: '0 4px 14px rgba(46, 29, 17, 0.26)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
