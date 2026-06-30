// /server/controllers/categoryController.js
const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({ data: categories });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCategories };
