const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');

// Load env vars
dotenv.config({ path: '../.env' });

const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mudal';

const seedCategories = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log('MongoDB connected for seeding...');

    const defaultCategories = [
      { name: 'Food & Dining', icon: 'restaurant', color: '#FF5722', type: 'expense', isDefault: true },
      { name: 'Transportation', icon: 'directions-car', color: '#2196F3', type: 'expense', isDefault: true },
      { name: 'Housing', icon: 'home', color: '#4CAF50', type: 'expense', isDefault: true },
      { name: 'Utilities', icon: 'bolt', color: '#FFC107', type: 'expense', isDefault: true },
      { name: 'Entertainment', icon: 'movie', color: '#9C27B0', type: 'expense', isDefault: true },
      { name: 'Healthcare', icon: 'local-hospital', color: '#F44336', type: 'expense', isDefault: true },
      { name: 'Salary', icon: 'work', color: '#4CAF50', type: 'income', isDefault: true },
      { name: 'Freelance', icon: 'computer', color: '#3F51B5', type: 'income', isDefault: true },
      { name: 'Investments', icon: 'trending-up', color: '#009688', type: 'income', isDefault: true },
    ];

    // Delete existing defaults (optional, but good for clean seeds)
    await Category.deleteMany({ isDefault: true });
    
    // Insert defaults
    await Category.insertMany(defaultCategories);

    console.log('Default categories seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error}`);
    process.exit(1);
  }
};

seedCategories();
