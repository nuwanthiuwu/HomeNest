// /server/routes/cartRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart } = require('../controllers/cartController');

router.use(verifyToken);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/', clearCart);
router.delete('/:productId', removeCartItem);

module.exports = router;
