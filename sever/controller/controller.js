const SuperMarket = require('../model/SuperMarket');


// Get all supermarkets
exports.getAllSupermarkets = async (req, res) => {
  try {
    const supermarkets = await SuperMarket.find();
    console.log('Tìm thấy', supermarkets.length, 'siêu thị');
    res.json(supermarkets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single supermarket by ID
exports.getSupermarketById = async (req, res) => {
  try {
    console.log('Tìm siêu thị với ID:', req.params.id);
    
    const supermarket = await SuperMarket.findOne({ supermarket_id: req.params.id });
    
    if (!supermarket) {
      console.log('Không tìm thấy siêu thị với ID:', req.params.id);
      return res.status(404).json({ message: 'Không tìm thấy siêu thị' });
    }
    
    console.log('Đã tìm thấy siêu thị:', supermarket);
    res.json(supermarket);
  } catch (error) {
    console.error('Lỗi khi tìm siêu thị:', error);
    res.status(500).json({ message: error.message });
  }
};
