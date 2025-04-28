const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');

// Lấy danh sách tất cả sản phẩm
router.get('/products', productController.getAllProducts);

// Lấy danh sách sản phẩm theo siêu thị
router.get('/products/supermarket/:id', productController.getProductsBySupermarket);

// Lấy thông tin một sản phẩm
router.get('/products/:id', productController.getProductById);

// Tạo sản phẩm mới

// Cập nhật thông tin sản phẩm


module.exports = router; 