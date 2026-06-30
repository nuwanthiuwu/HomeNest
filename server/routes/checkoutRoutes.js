// /server/routes/checkoutRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { placeOrder, validateCoupon } = require('../controllers/checkoutController');

router.post('/validate-coupon', verifyToken, validateCoupon);
router.post('/', verifyToken, placeOrder);

module.exports = router;
