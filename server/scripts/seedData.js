// /server/scripts/seedData.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Promotion = require('../models/Promotion');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Promotion.deleteMany({});
    console.log('Cleared existing data');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Electronic devices and gadgets', isActive: true },
      { name: 'Home & Kitchen', description: 'Home and kitchen items', isActive: true },
      { name: 'Furniture', description: 'Furniture for your home', isActive: true },
      { name: 'Decor', description: 'Home decor items', isActive: true },
    ]);
    console.log(`✓ Created ${categories.length} categories`);

    // Create featured products
    const products = await Product.insertMany([
      // Featured products
      {
        name: 'Wireless Headphones Pro',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        stock: 50,
        category: categories[0]._id,
        rating: 4.5,
        reviews: 128,
        featured: true,
        image: 'https://picsum.photos/300/300?random=1',
        isActive: true,
      },
      {
        name: 'Smart Watch Ultra',
        description: 'Latest smartwatch with fitness tracking',
        price: 349.99,
        stock: 30,
        category: categories[0]._id,
        rating: 4.7,
        reviews: 89,
        featured: true,
        image: 'https://picsum.photos/300/300?random=',
        isActive: true,
      },
      {
        name: 'Coffee Maker Deluxe',
        description: 'Programmable coffee maker with timer',
        price: 89.99,
        stock: 45,
        category: categories[1]._id,
        rating: 4.3,
        reviews: 256,
        featured: true,
        image: 'https://picsum.photos/300/300?random=',
        isActive: true,
      },
      {
        name: 'Kitchen Knife Set',
        description: 'Professional grade kitchen knife set',
        price: 149.99,
        stock: 60,
        category: categories[1]._id,
        rating: 4.6,
        reviews: 142,
        featured: true,
        image: 'https://picsum.photos/300/300?random=',
        isActive: true,
      },
      {
        name: 'Modern Office Chair',
        description: 'Ergonomic office chair with lumbar support',
        price: 299.99,
        stock: 25,
        category: categories[2]._id,
        rating: 4.4,
        reviews: 95,
        featured: true,
        image: 'https://picsum.photos/300/300?random=',
        isActive: true,
      },
      {
        name: 'Wooden Dining Table',
        description: 'Spacious dining table for 6 people',
        price: 599.99,
        stock: 12,
        category: categories[2]._id,
        rating: 4.8,
        reviews: 67,
        featured: true,
        image: 'https://picsum.photos/300/300?random=',
        isActive: true,
      },
      // New arrivals (recently added, not featured)
      {
        name: 'Portable Speaker',
        description: 'Waterproof Bluetooth speaker',
        price: 79.99,
        stock: 40,
        category: categories[0]._id,
        rating: 4.2,
        reviews: 73,
        featured: false,
        image: 'https://picsum.photos/300/300?random=',
        isActive: true,
      },
      {
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with USB charging',
        price: 39.99,
        stock: 100,
        category: categories[3]._id,
        rating: 4.5,
        reviews: 112,
        featured: false,
        image: 'https://picsum.photos/300/300?random=',
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
        image: 'https://picsum.photos/1200/400?random=99',
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    ]);
    console.log(`✓ Created ${promotions.length} promotions`);

    console.log('\n✅ Seed data created successfully!');
    console.log(`
    Sample data:
    - ${categories.length} categories
    - ${products.length} products (6 featured, 2 new arrivals)
    - ${promotions.length} active promotion

    Visit http://localhost:5173 to see the home page with data!
    `);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
