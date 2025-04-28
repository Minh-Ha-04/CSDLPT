import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';

const Home = () => {
  const navigate = useNavigate();
  const [supermarkets, setSupermarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupermarkets = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('http://localhost:5000/api/supermarkets');
        
        if (!response.data) {
          throw new Error('Không nhận được dữ liệu từ server');
        }
        
        if (!Array.isArray(response.data)) {
          throw new Error('Dữ liệu không đúng định dạng');
        }
        
        setSupermarkets(response.data);
      } catch (error) {
        console.error('Error fetching supermarkets:', error);
        setError(error.message || 'Không thể tải danh sách siêu thị. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupermarkets();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang hoạt động':
        return 'success';
      case 'Tạm ngưng':
        return 'warning';
      case 'Đã đóng cửa':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleSupermarketClick = (id) => {
    navigate(`/supermarket/${id}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách siêu thị
      </Typography>
      <Grid container spacing={3}>
        {supermarkets && supermarkets.length > 0 ? (
          supermarkets.map((supermarket) => (
            <Grid 
              key={supermarket.id}
              sx={{
                width: {
                  xs: '100%',
                  sm: '50%',
                  md: '33.33%'
                }
              }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 6
                  }
                }}
                onClick={() => handleSupermarketClick(supermarket.supermarket_id)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" component="h2">
                      {supermarket.name}
                    </Typography>
                    <Chip 
                      label={supermarket.status} 
                      color={getStatusColor(supermarket.status)}
                      size="small"
                    />
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    Mã: {supermarket.id}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {supermarket.address}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Box mt={1}>
                    <Typography variant="body2" color="textSecondary">
                      Email: {supermarket.email}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Số điện thoại: {supermarket.phone}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid sx={{ width: '100%' }}>
            <Alert severity="info">Không có siêu thị nào </Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Home; 