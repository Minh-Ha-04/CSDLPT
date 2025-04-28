const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employee_id: {
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
  gender: {
    type: String,
    required: true,
    enum: ['Nam', 'Nữ'],
    default: 'Nam'
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    enum: ['Quản lý', 'Nhân viên bán hàng', 'Thu ngân', 'Bảo vệ', 'Kho'],
    default: 'Nhân viên bán hàng'
  },
  supermarket_id: {
    type: String,
    required: true,
    trim: true,
    ref: 'SuperMarket'
  },
}, {
  timestamps: true
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee; 