const Customer = require('../model/Customer');

// Lấy danh sách tất cả khách hàng
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách khách hàng:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách khách hàng' });
  }
};

// Lấy thông tin một khách hàng theo ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ customer_id: req.params.id });
    if (!customer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khách hàng:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thông tin khách hàng' });
  }
};

// Tạo khách hàng mới
exports.createCustomer = async (req, res) => {
  try {
    // Kiểm tra xem ID khách hàng đã tồn tại chưa
    const existingCustomer = await Customer.findOne({ customer_id: req.body.customer_id });
    if (existingCustomer) {
      return res.status(400).json({ message: 'ID khách hàng đã tồn tại' });
    }

    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Lỗi khi tạo khách hàng:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Lỗi server khi tạo khách hàng' });
  }
};

// Cập nhật thông tin khách hàng
exports.updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findOneAndUpdate(
      { customer_id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error('Lỗi khi cập nhật khách hàng:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Lỗi server khi cập nhật khách hàng' });
  }
};

// Xóa khách hàng
exports.deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findOneAndDelete({ customer_id: req.params.id });
    
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    
    res.status(200).json({ message: 'Đã xóa khách hàng thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa khách hàng:', error);
    res.status(500).json({ message: 'Lỗi server khi xóa khách hàng' });
  }
};

// Tìm kiếm khách hàng
exports.searchCustomers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm' });
    }

    const customers = await Customer.find({
      $or: [
        { customer_id: { $regex: query, $options: 'i' } },
        { customer_name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.status(200).json(customers);
  } catch (error) {
    console.error('Lỗi khi tìm kiếm khách hàng:', error);
    res.status(500).json({ message: 'Lỗi server khi tìm kiếm khách hàng' });
  }
}; 