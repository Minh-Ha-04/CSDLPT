const mongoose = require('mongoose');

const supermarketSchema = new mongoose.Schema({
  supermarket_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{10,11}$/, 'Please enter a valid phone number']
  },
  status: {
    type: String,
    required: true,
    enum: ['Đang hoạt động', 'Tạm ngưng', 'Đã đóng cửa'],
    default: 'Đang hoạt động'
  },
}, {
  timestamps: true
});

const SuperMarket = mongoose.model('SuperMarket', supermarketSchema);

module.exports = SuperMarket;
