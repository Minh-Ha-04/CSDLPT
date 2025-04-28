const Employee = require('../model/Employee');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employees by supermarket

exports.getEmployeesBySupermarket = async (req, res) => {
  try {
    const employees = await Employee.find({ supermarket_id: req.params.id });
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Không thể lấy danh sách nhân viên' });
  }
};
