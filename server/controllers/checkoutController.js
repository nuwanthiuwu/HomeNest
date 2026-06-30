// /server/controllers/checkoutController.js

const Joi = require('joi');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');

const placeOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().allow('').optional(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().default('US'),
  }).required(),
  paymentMethod: Joi.string().valid('card', 'paypal', 'cod').required(),
  couponCode: Joi.string().uppercase().trim().optional(),
});

const placeOrder = async (req, res) => {
  try {
    const { error, value } = placeOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { shippingAddress, paymentMethod, couponCode } = value;

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `"${item.product.name}" is out of stock` });
      }
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (!coupon || coupon.expiryDate < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired coupon' });
      }
      discount = Math.round(subtotal * coupon.discountPercent) / 100;
    }

    const total = subtotal - discount;

    const order = await Order.create({
      user: req.user.id,
      items: cart.items.map((i) => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.image,
        quantity: i.quantity,
        price: i.price,
      })),
      shippingAddress,
      paymentMethod,
      subtotal,
      discount,
      total,
    });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    cart.items = [];
    await cart.save();

    return res.status(201).json({ data: { orderId: order._id } });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getOrderConfirmation = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name image');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.status(200).json({ data: { order } });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const validateCoupon = async (req, res) => {
  const { couponCode, subtotal } = req.body;
  if (!couponCode || subtotal === undefined) {
    return res.status(400).json({ message: 'couponCode and subtotal are required' });
  }
  try {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true });
    if (!coupon || coupon.expiryDate < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired coupon' });
    }
    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`,
      });
    }
    const discount = Math.round(subtotal * coupon.discountPercent) / 100;
    return res.status(200).json({ discount, discountPercent: coupon.discountPercent, code: coupon.code });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { placeOrder, getOrderConfirmation, validateCoupon };
