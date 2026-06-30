// /server/controllers/cartController.js

const Joi = require('joi');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const populateFields = 'name price image stock';

const calcTotals = (items) => ({
  totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
});

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product', populateFields);

    if (!cart) {
      return res.status(200).json({ data: { items: [], totalItems: 0, totalPrice: 0 } });
    }

    const { totalItems, totalPrice } = calcTotals(cart.items);
    return res.status(200).json({ data: { items: cart.items, totalItems, totalPrice } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const addToCart = async (req, res) => {
  try {
    const schema = Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.number().min(0).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { productId, quantity, price } = value;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );

    if (existingIndex > -1) {
      const newQuantity = cart.items[existingIndex].quantity + quantity;
      if (product.stock < newQuantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      cart.items[existingIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity, price });
    }

    await cart.save();
    await cart.populate('items.product', populateFields);

    const { totalItems, totalPrice } = calcTotals(cart.items);
    return res.status(200).json({ data: { items: cart.items, totalItems, totalPrice } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const schema = Joi.object({
      quantity: Joi.number().min(1).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { quantity } = value;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate('items.product', populateFields);

    const { totalItems, totalPrice } = calcTotals(cart.items);
    return res.status(200).json({ data: { items: cart.items, totalItems, totalPrice } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);

    await cart.save();
    await cart.populate('items.product', populateFields);

    const { totalItems, totalPrice } = calcTotals(cart.items);
    return res.status(200).json({ data: { items: cart.items, totalItems, totalPrice } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(200).json({ data: { items: [], totalItems: 0, totalPrice: 0 } });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({ data: { items: [], totalItems: 0, totalPrice: 0 } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
