// /server/controllers/promotionController.js
const Promotion = require('../models/Promotion');

const getActivePromotions = async (req, res) => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: null }, { endDate: { $gte: now } }],
    });
    res.status(200).json({ data: promotions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getActivePromotions };
