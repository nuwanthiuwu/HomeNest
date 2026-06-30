// /server/routes/promotionRoutes.js
const express = require('express');
const router = express.Router();
const { getActivePromotions } = require('../controllers/promotionController');

router.get('/active', getActivePromotions);

module.exports = router;
