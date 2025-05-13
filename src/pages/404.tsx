import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center' }}>
      <Box mb={4}>
        <Typography variant="h1" color="error" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={2}>
          Oops! The page you're looking for doesn't exist.
        </Typography>
      </Box>

      <Button
        component={Link}
        to="/dashboard"
        variant="contained"
        color="primary"
        size={isMobile ? 'small' : 'medium'}
      >
        Go to Homepage
      </Button>
    </Container>
  );
};

export default NotFound;