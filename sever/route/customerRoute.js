const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');

// Lấy danh sách tất cả khách hàng
router.get('/', customerController.getAllCustomers);

// Tìm kiếm khách hàng
router.get('/search', customerController.searchCustomers);

// Lấy thông tin một khách hàng theo ID
router.get('/:id', customerController.getCustomerById);

// Tạo khách hàng mới
router.post('/', customerController.createCustomer);

// Cập nhật thông tin khách hàng
router.put('/:id', customerController.updateCustomer);

// Xóa khách hàng
router.delete('/:id', customerController.deleteCustomer);

module.exports = router; 