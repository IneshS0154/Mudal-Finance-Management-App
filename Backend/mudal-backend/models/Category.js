const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
  },
  icon: {
    type: String,
    required: [true, 'Category icon is required'],
  },
  color: {
    type: String,
    required: [true, 'Category color is required'],
  },
  type: {
    type: String,
    required: [true, 'Category type is required'],
    enum: ['income', 'expense'],
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Null for preset categories
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Category', categorySchema);
