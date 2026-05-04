const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    category: {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      icon: { type: String, default: 'other' },
      color: { type: String, default: '#A0A0A0' },
    },
    limit: {
      type: Number,
      required: [true, 'Budget limit is required'],
      min: [0.01, 'Limit must be positive'],
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent cannot be negative'],
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      default: () => new Date().getMonth() + 1, // 1-12
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
  },
  { timestamps: true }
);

// Compound index to ensure one budget per category per month/year
budgetSchema.index({ 'category._id': 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema, 'budgets');
