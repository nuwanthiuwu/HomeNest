// /server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, searchProducts, getProductById } = require('../controllers/productController');

router.get('/search', searchProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
