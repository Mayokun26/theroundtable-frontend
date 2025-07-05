// Site-wide theme customization
import { createTheme } from '@mui/material/styles';

// Custom color palette inspired by historical themes
const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // SaddleBrown - rich, warm wood tone reminiscent of old libraries and scholars' desks
      light: '#A0522D', // Sienna
      dark: '#654321', // Dark brown
      contrastText: '#F5F5DC', // Beige
    },
    secondary: {
      main: '#4B0082', // Indigo - royal purple, symbolizing wisdom and nobility
      light: '#9370DB', // Medium purple
      dark: '#483D8B', // Dark slate blue
      contrastText: '#FFF8DC', // Cornsilk
    },
    background: {
      default: '#FFF8E1', // Very light warm beige background, like parchment
      paper: '#FFFAF0', // Floral white - slightly off-white for cards/panels
    },
    text: {
      primary: '#3E2723', // Very dark brown - easier to read than pure black
      secondary: '#5D4037', // Brown - for secondary text
    },
    // Error/warning colors maintained for accessibility
    error: {
      main: '#B71C1C', // Dark red
    },
    warning: {
      main: '#E65100', // Dark orange
    },
    info: {
      main: '#0D47A1', // Dark blue
    },
    success: {
      main: '#1B5E20', // Dark green
    },
  },
  typography: {
    fontFamily: "'Crimson Text', 'Garamond', 'Times New Roman', serif",
    h1: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 600,
    },
    h2: {
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 600,
    },
    h3: {
      fontFamily: "'Cormorant Garamond', serif",
    },
    h4: {
      fontFamily: "'Cormorant Garamond', serif",
    },
    h5: {
      fontFamily: "'Cormorant Garamond', serif",
    },
    h6: {
      fontFamily: "'Cormorant Garamond', serif",
    },
    button: {
      fontWeight: 600,
      letterSpacing: 1,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          border: '1px solid rgba(139, 69, 19, 0.2)', // Subtle border
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textTransform: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #4B0082 0%, #9370DB 100%)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #654321 0%, #8B4513 100%)',
          boxShadow: '0 2px 10px rgba(101, 67, 33, 0.4)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(139, 69, 19, 0.3)',
              borderRadius: 4,
            },
            '&:hover fieldset': {
              borderColor: 'rgba(139, 69, 19, 0.5)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default shadows
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;
