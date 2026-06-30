// /server/controllers/productController.js
const Joi = require('joi');
const mongoose = require('mongoose');
const Product = require('../models/Product');

// GET /api/products - list with filters, sort, pagination
const getProducts = async (req, res) => {
  const schema = Joi.object({
    category: Joi.string().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    inStock: Joi.boolean().optional(),
    rating: Joi.number().min(0).max(5).optional(),
    sort: Joi.string()
      .valid('price_asc', 'price_desc', 'newest', 'rating')
      .optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  });

  const { error, value } = schema.validate(req.query);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { category, minPrice, maxPrice, inStock, rating, sort, page, limit } = value;

    // Build filter object
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (inStock === true) {
      filter.stock = { $gt: 0 };
    }

    if (rating !== undefined) {
      filter.rating = { $gte: rating };
    }

    // Build sort object
    let sortObj = { createdAt: -1 }; // default: newest first
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: {
        products,
        total,
        page,
        totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products/search - full-text search
const searchProducts = async (req, res) => {
  const schema = Joi.object({
    q: Joi.string().trim().min(1).required(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  });

  const { error, value } = schema.validate(req.query);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { q, page, limit } = value;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Full-text search on name and description fields
    const products = await Product.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
      .populate('category', 'name')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({
      $text: { $search: q },
      isActive: true,
    });
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: {
        products,
        total,
        page,
        totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/products/:id - single product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id).populate('category', 'name');

    if (!product || product.isActive === false) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ data: { product } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  searchProducts,
  getProductById,
};
