const Product = require('../model/Product');

// Lấy danh sách tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Không thể lấy danh sách sản phẩm' });
  }
};

// Lấy danh sách sản phẩm theo siêu thị
const getProductsBySupermarket = async (req, res) => {
  try {
    const products = await Product.find({ supermarket_id: req.params.id });
    res.json(products || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Không thể lấy danh sách sản phẩm' });
  }
};

// Lấy thông tin một sản phẩm
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Không thể lấy thông tin sản phẩm' });
  }
};

module.exports = {
  getAllProducts,
  getProductsBySupermarket,
  getProductById
};
