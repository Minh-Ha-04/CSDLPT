const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true
  },
  supermarket_id: {
    type: String,
    required: true,
    ref: 'SuperMarket'
  },
  product_name: {
    type: String,
    required: true
  },
  'Giá bán': {
    type: Number,
    required: true,
    min: 0
  },
  'Hãng sản xuất': {
    type: String,
    required: true
  },
  'Hạn sử dụng': {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Middleware để chuyển đổi chuỗi ngày thành Date object trước khi lưu
productSchema.pre('save', function(next) {
  if (typeof this['Hạn sử dụng'] === 'string') {
    const [day, month, year] = this['Hạn sử dụng'].split('/');
    this['Hạn sử dụng'] = new Date(year, month - 1, day);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

