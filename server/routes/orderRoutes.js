// /server/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getOrderConfirmation } = require('../controllers/checkoutController');

router.get('/:id/confirmation', verifyToken, getOrderConfirmation);

module.exports = router;
