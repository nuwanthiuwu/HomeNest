// /server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, searchProducts } = require('../controllers/productController');

router.get('/search', searchProducts);
router.get('/', getProducts);

module.exports = router;
