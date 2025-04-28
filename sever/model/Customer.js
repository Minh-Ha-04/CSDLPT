const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customer_name: {
    type: String,
    required: true,
    trim: true
  },
  birthday: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  }
}, {
  timestamps: true
});

// Tạo index cho các trường thường được tìm kiếm
customerSchema.index({ customer_id: 1 });
customerSchema.index({ customer_name: 1 });
customerSchema.index({ phone: 1 });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer; 