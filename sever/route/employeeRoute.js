const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employeeController');
const Employee = require('../model/Employee');

// Get all employees
router.get('/employees', employeeController.getAllEmployees);

// Get employees by supermarket

// Lấy danh sách nhân viên theo siêu thị
router.get('/employees/supermarket/:id', employeeController.getEmployeesBySupermarket);


// Tạo nhân viên mới

// Cập nhật thông tin nhân viên


module.exports = router; 