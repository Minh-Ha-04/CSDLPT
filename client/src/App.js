import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, AppBar, Toolbar, Typography, Container } from '@mui/material';
import Home from './components/Home';
import SupermarketDetail from './components/SupermarketDetail';


function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Quản lý chuỗi siêu thị
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/supermarket/:id" element={<SupermarketDetail />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
