const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const supermarketRoutes = require('./route/route');
const employeeRoutes = require('./route/employeeRoute');
const invoiceRoutes = require('./route/invoiceRoute');
const productRoutes = require('./route/productRoute');
const customerRoutes = require('./route/customerRoute');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api', supermarketRoutes);
app.use('/api', employeeRoutes);
app.use('/api', invoiceRoutes);
app.use('/api', productRoutes);
app.use('/api/customers', customerRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/supermarket_web', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');
    
    // Start server after successful database connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};

// Connect to MongoDB and start server
connectDB(); 