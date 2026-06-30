// /server/controllers/productController.js
const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { featured, sort, category, limit = 20, page = 1 } = req.query;

    let query = { isActive: true };

    if (featured === 'true') {
      query.featured = true;
    }

    if (category) {
      query.category = category;
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'newest') {
      sortObj = { createdAt: -1 };
    } else if (sort === 'price-asc') {
      sortObj = { price: 1 };
    } else if (sort === 'price-desc') {
      sortObj = { price: -1 };
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('category', 'name');

    const total = await Product.countDocuments(query);

    res.status(200).json({
      data: products,
      pagination: { total, page: parseInt(page), limit: parseInt(limit) },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ data: product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProducts, getProductById };
