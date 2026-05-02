const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be positive'],
    },
    category: {
      _id: { type: String, default: null },
      name: { type: String, default: '' },
      icon: { type: String, default: 'other' },
      color: { type: String, default: '#A0A0A0' },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Recurring',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema, 'transactions');
