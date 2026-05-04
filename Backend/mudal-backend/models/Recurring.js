const mongoose = require('mongoose');

const recurringSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be positive'],
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: 'monthly',
    },
    // Stored as embedded object so category info is always available
    category: {
      _id: { type: String, default: null },
      name: { type: String, default: '' },
      icon: { type: String, default: 'other' },
      color: { type: String, default: '#A0A0A0' },
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    nextDueDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Calculate nextDueDate based on frequency
recurringSchema.pre('save', function () {
  if (this.isModified('startDate') || this.isModified('frequency') || this.isNew) {
    const date = new Date(this.startDate);
    switch (this.frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setDate(date.getDate() + 30);
        break;
      case 'yearly':
        date.setDate(date.getDate() + 365);
        break;
      default:
        break;
    }
    this.nextDueDate = date;
  }
});

module.exports = mongoose.model('Recurring', recurringSchema, 'recurringtransactions');
