// /server/scripts/seedData.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Promotion = require('../models/Promotion');
const Coupon = require('../models/Coupon');

// picsum.photos seed-based URLs — stable and always available
const img = (seed, w = 400, h = 400) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Promotion.deleteMany({});
    await Coupon.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Electronic devices and gadgets', isActive: true },
      { name: 'Home & Kitchen', description: 'Home and kitchen items', isActive: true },
      { name: 'Furniture', description: 'Furniture for your home', isActive: true },
      { name: 'Decor', description: 'Home decor items', isActive: true },
    ]);
    console.log(`✓ Created ${categories.length} categories`);

    // Create products with multiple images each
    const products = await Product.insertMany([
      // Electronics
      {
        name: 'Wireless Headphones Pro',
        description:
          'Experience premium sound quality with our flagship wireless headphones. Features active noise cancellation, 30-hour battery life, and ultra-comfortable memory foam ear cushions. Compatible with all Bluetooth 5.0 devices.',
        price: 199.99,
        stock: 50,
        category: categories[0]._id,
        rating: 4.5,
        reviews: 128,
        featured: true,
        image: img('headphones1'),
        images: [img('headphones1'), img('headphones2'), img('headphones3')],
        isActive: true,
      },
      {
        name: 'Smart Watch Ultra',
        description:
          'The most advanced smartwatch yet. Tracks your heart rate, sleep, steps, and blood oxygen. Water-resistant to 50m, built-in GPS, 7-day battery, and a stunning always-on AMOLED display.',
        price: 349.99,
        stock: 8,
        category: categories[0]._id,
        rating: 4.7,
        reviews: 89,
        featured: true,
        image: img('smartwatch1'),
        images: [img('smartwatch1'), img('smartwatch2'), img('smartwatch3')],
        isActive: true,
      },
      {
        name: 'Portable Bluetooth Speaker',
        description:
          'Powerful 360° surround sound in a compact, waterproof design. IPX7 rated for pool and beach use. 20-hour playtime, built-in speakerphone, and a built-in power bank for charging your devices.',
        price: 79.99,
        stock: 40,
        category: categories[0]._id,
        rating: 4.2,
        reviews: 73,
        featured: false,
        image: img('speaker1'),
        images: [img('speaker1'), img('speaker2'), img('speaker3')],
        isActive: true,
      },
      // Home & Kitchen
      {
        name: 'Coffee Maker Deluxe',
        description:
          'Brew the perfect cup every morning with our 12-cup programmable coffee maker. Features an adjustable strength setting, built-in grinder, keep-warm plate, and a pause-and-pour function.',
        price: 89.99,
        stock: 45,
        category: categories[1]._id,
        rating: 4.3,
        reviews: 256,
        featured: true,
        image: img('coffeemaker1'),
        images: [img('coffeemaker1'), img('coffeemaker2'), img('coffeemaker3')],
        isActive: true,
      },
      {
        name: 'Professional Kitchen Knife Set',
        description:
          'A complete 8-piece knife set forged from German high-carbon stainless steel. Includes chef, bread, carving, utility, and paring knives, plus kitchen shears and a honing rod. Full-tang construction for perfect balance.',
        price: 149.99,
        stock: 0,
        category: categories[1]._id,
        rating: 4.6,
        reviews: 142,
        featured: true,
        image: img('knifeset1'),
        images: [img('knifeset1'), img('knifeset2'), img('knifeset3')],
        isActive: true,
      },
      // Furniture
      {
        name: 'Modern Ergonomic Office Chair',
        description:
          'Work in comfort all day with our fully adjustable ergonomic chair. Features lumbar support, adjustable armrests, breathable mesh back, 360° swivel, and height-adjustable seat. Supports up to 300 lbs.',
        price: 299.99,
        stock: 25,
        category: categories[2]._id,
        rating: 4.4,
        reviews: 95,
        featured: true,
        image: img('officechair1'),
        images: [img('officechair1'), img('officechair2'), img('officechair3')],
        isActive: true,
      },
      {
        name: 'Solid Wood Dining Table',
        description:
          'Gather the whole family around this stunning 6-seat solid acacia wood dining table. Hand-finished with natural oil to highlight the unique grain patterns. Seats up to 6 comfortably with a 72" x 36" surface.',
        price: 599.99,
        stock: 3,
        category: categories[2]._id,
        rating: 4.8,
        reviews: 67,
        featured: true,
        image: img('diningtable1'),
        images: [img('diningtable1'), img('diningtable2'), img('diningtable3')],
        isActive: true,
      },
      // Decor
      {
        name: 'LED Desk Lamp with USB Charging',
        description:
          'Illuminate your workspace with adjustable color temperature (2700K–6500K) and 5 brightness levels. Built-in 5W USB-A and USB-C ports for charging devices. Touch-sensitive controls and a memory function.',
        price: 39.99,
        stock: 100,
        category: categories[3]._id,
        rating: 4.5,
        reviews: 112,
        featured: false,
        image: img('desklamp1'),
        images: [img('desklamp1'), img('desklamp2'), img('desklamp3')],
        isActive: true,
      },
    ]);
    console.log(`✓ Created ${products.length} products`);

    // Create promotions
    const promotions = await Promotion.insertMany([
      {
        title: 'Summer Sale - Up to 50% Off',
        description: 'Limited time offer on selected items',
        ctaText: 'Shop Sale',
        ctaLink: '/products?sale=true',
        image: img('sale-banner', 1200, 400),
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log(`✓ Created ${promotions.length} promotions`);

    const coupons = await Coupon.insertMany([
      {
        code: 'SAVE10',
        discountPercent: 10,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        minOrderAmount: 0,
      },
      {
        code: 'SAVE20',
        discountPercent: 20,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        minOrderAmount: 100,
      },
      {
        code: 'WELCOME',
        discountPercent: 15,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        minOrderAmount: 0,
      },
    ]);
    console.log(`✓ Created ${coupons.length} coupons`);

    console.log('\n✅ Seed data created successfully!');
    console.log(`
    Sample data:
    - ${categories.length} categories
    - ${products.length} products (6 featured, 2 new arrivals)
    - ${promotions.length} active promotion
    - ${coupons.length} coupons

    Run: npm run seed  →  then visit http://localhost:5173
    `);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
