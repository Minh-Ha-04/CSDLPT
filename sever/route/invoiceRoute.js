const express = require('express');
const router = express.Router();
const Invoice = require('../model/Invoice');

// Lấy danh sách hóa đơn
router.get('/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Không thể lấy danh sách hóa đơn' });
  }
});

// Lấy danh sách hóa đơn theo siêu thị
router.get('/invoices/supermarket/:id', async (req, res) => {
  try {
    const invoices = await Invoice.find({ supermarket_id: req.params.id });
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Không thể lấy danh sách hóa đơn' });
  }
});

// Lấy thông tin một hóa đơn
router.get('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoice_id: req.params.id });
    if (!invoice) {
      return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ message: 'Không thể lấy thông tin hóa đơn' });
  }
});

// Tạo hóa đơn mới
router.post('/invoices', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Không thể tạo hóa đơn mới' });
  }
});

// Cập nhật thông tin hóa đơn


// Xóa hóa đơn
router.delete('/invoices/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ invoice_id: req.params.id });
    if (!invoice) {
      return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    }
    res.json({ message: 'Đã xóa hóa đơn thành công' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Không thể xóa hóa đơn' });
  }
});

module.exports = router; 