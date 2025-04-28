const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  'product_id': {
    type: String,
    required: true
  },
  'product_name': {
    type: String,
    required: true
  },
  'unit': {
    type: Number,
    required: true,
    min: 1
  },
  'price': {
    type: Number,
    required: true,
    min: 0
  }
});

const invoiceSchema = new mongoose.Schema({
  'invoice_id': {
    type: String,
    required: true,
    unique: true
  },
  'supermarket_id': {
    type: String,
    required: true,
    ref: 'SuperMarket'
  },
  'employee_id': {
    type: String,
    required: true,
    ref: 'Employee'
  },
  'customer_id': {
    type: String,
    required: true,
    ref: 'Customer'
  },
  'customer_name': {
    type: String,
    required: true
  },
  'phone': {
    type: String,
    required: true
  },
  'date_sale': {
    type: Date,
    required: true
  },
  'product_list': {
    type: [productSchema],
    required: true
  },
  'payment': {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Middleware để tự động tính tổng tiền trước khi lưu
invoiceSchema.pre('save', function(next) {
  this['payment'] = this['product_list'].reduce((total, product) => {
    return total + (product['unit'] * product['price']);
  }, 0);
  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
