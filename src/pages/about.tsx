import React from 'react';
import { useRouter } from 'next/router';
import { 
  Container, 
  Typography, 
  Box,
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import Head from 'next/head';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SchoolIcon from '@mui/icons-material/School';
import DvrIcon from '@mui/icons-material/Dvr';

export default function About() {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>About | The Round Table</title>
        <meta name="description" content="Learn about The Round Table platform and how it uses AI to simulate conversations with historical figures." />
      </Head>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box mb={4}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.push('/')}
            variant="outlined"
            sx={{ mb: 3 }}
          >
            Back to Home
          </Button>
          
          <Typography variant="h3" component="h1" gutterBottom>
            About The Round Table
          </Typography>
          
          <Typography variant="h6" color="text.secondary" paragraph>
            A platform for engaging discussions with historical figures powered by artificial intelligence
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" gutterBottom>Our Mission</Typography>
              <Typography paragraph>
                The Round Table aims to make history and knowledge more accessible and engaging through interactive conversations. 
                By leveraging advanced AI technology, we bring historical figures to life, allowing users to ask questions, 
                explore ideas, and gain insights from some of history's most influential minds.
              </Typography>
              <Typography paragraph>
                Whether you're a student, educator, history enthusiast, or simply curious, our platform provides 
                an innovative way to connect with the past and learn from historical perspectives on contemporary issues.
              </Typography>
            </Paper>
            
            <Paper elevation={2} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>How It Works</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><HistoryEduIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Historical Accuracy" 
                    secondary="Our AI models are trained on extensive historical data, primary sources, and scholarly works to ensure responses reflect the authentic perspectives and knowledge of each historical figure." 
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon><PsychologyIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Personality Modeling" 
                    secondary="Each character has a unique personality profile based on historical records, writings, and accounts, allowing for interactions that capture their distinctive voice and mannerisms." 
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
                  <ListItemText 
                    primary="Educational Focus" 
                    secondary="Our responses prioritize educational value, providing insights that align with historical facts while making complex ideas accessible." 
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>Technical Details</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><DvrIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Next.js Frontend" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DvrIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Node.js/Express Backend" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DvrIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="DynamoDB Database" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DvrIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Redis Caching" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><DvrIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Advanced LLM Integration" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
            
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h5" gutterBottom>Get Started</Typography>
                <Typography paragraph>
                  Ready to step back in time and engage with history's greatest minds?
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  onClick={() => router.push('/conversation')}
                >
                  Begin a Conversation
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
} 