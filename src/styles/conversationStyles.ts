// Custom styles for the conversation page
import { SxProps, Theme } from '@mui/material';

export const conversationStyles = {
  mainContainer: {
    minHeight: '100vh',
    backgroundImage: 'url("/images/parchment-bg.jpg")', // Add this image to your public folder
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    paddingTop: 2,
    paddingBottom: 4,
  },
  
  headerSection: {
    padding: 2, 
    backdropFilter: 'blur(5px)',
    background: 'rgba(255, 248, 225, 0.7)',
    borderBottom: '1px solid rgba(139, 69, 19, 0.3)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  
  panelTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    color: '#5D4037',
    textAlign: 'center',
    margin: '20px 0',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  },
  
  characterCard: {
    transition: 'transform 0.2s, box-shadow 0.2s',
    background: 'rgba(255, 250, 240, 0.9)',
    border: '1px solid rgba(139, 69, 19, 0.2)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    },
  },
  
  selectedCharacterCard: {
    border: '2px solid #8B4513',
    boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3) !important',
    background: 'rgba(255, 248, 225, 0.95)',
  },
  
  characterImage: {
    borderRadius: '50%',
    width: 60,
    height: 60,
    objectFit: 'cover',
    border: '2px solid #8B4513',
  },
  
  characterName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    color: '#3E2723',
  },
  
  characterEra: {
    color: '#5D4037',
    fontStyle: 'italic',
    fontSize: '0.9rem',
  },
  
  confirmButton: {
    background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
    color: '#FFF8DC',
    padding: '12px 24px',
    fontSize: '1.1rem',
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 600,
    letterSpacing: 1,
    boxShadow: '0 4px 8px rgba(139, 69, 19, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #A0522D 0%, #8B4513 100%)',
      boxShadow: '0 6px 12px rgba(139, 69, 19, 0.4)',
    },
    '&:disabled': {
      background: '#D2B48C',
      color: '#8B4513',
    },
  },
  
  chatContainer: {
    background: 'rgba(255, 250, 240, 0.85)',
    borderRadius: 8,
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    padding: 3,
    marginTop: 4,
    border: '1px solid rgba(139, 69, 19, 0.2)',
  },
  
  messageSection: {
    backgroundColor: 'rgba(255, 248, 225, 0.7)',
    borderRadius: 8,
    padding: 2,
    margin: '16px 0',
    maxHeight: '60vh',
    overflowY: 'auto',
    border: '1px solid rgba(139, 69, 19, 0.1)',
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 248, 225, 0.5)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#D2B48C',
      borderRadius: '4px',
    },
  },
  
  userMessage: {
    backgroundColor: 'rgba(75, 0, 130, 0.05)', // Very light indigo
    borderRadius: '16px 16px 0 16px',
    padding: '12px 16px',
    marginBottom: 2,
    maxWidth: '80%',
    alignSelf: 'flex-end',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid rgba(75, 0, 130, 0.1)',
  },
  
  characterMessage: {
    backgroundColor: 'rgba(139, 69, 19, 0.05)', // Very light brown
    borderRadius: '16px 16px 16px 0',
    padding: '12px 16px',
    marginBottom: 2,
    maxWidth: '80%',
    alignSelf: 'flex-start',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    border: '1px solid rgba(139, 69, 19, 0.1)',
  },
  
  messageInput: {
    border: '1px solid rgba(139, 69, 19, 0.3)',
    borderRadius: 8,
    padding: 2,
    backgroundColor: 'rgba(255, 250, 240, 0.9)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginTop: 2,
    '&:focus-within': {
      boxShadow: '0 2px 12px rgba(139, 69, 19, 0.15)',
    },
  },
  
  sendButton: {
    background: 'linear-gradient(135deg, #4B0082 0%, #9370DB 100%)',
    color: '#FFF8DC',
    borderRadius: '50%',
    width: 56,
    height: 56,
    boxShadow: '0 4px 8px rgba(75, 0, 130, 0.3)',
    '&:hover': {
      background: 'linear-gradient(135deg, #9370DB 0%, #4B0082 100%)',
      boxShadow: '0 6px 12px rgba(75, 0, 130, 0.4)',
    },
    '&:disabled': {
      background: '#B19CD9',
    },
  },
};

export default conversationStyles;
