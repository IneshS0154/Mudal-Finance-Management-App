const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please add a target amount'],
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  durationMonths: {
    type: Number,
    required: [true, 'Please add duration in months'],
  },
  monthlyDeduction: {
    type: Number,
  },
  category: {
    name: { type: String, default: 'Goal' },
    icon: { type: String, default: 'goal' },
    color: { type: String, default: '#6C5CE7' },
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Calculate monthly deduction before saving
GoalSchema.pre('save', async function() {
  if (this.targetAmount && this.durationMonths) {
    this.monthlyDeduction = Math.round(this.targetAmount / this.durationMonths);
  }
});

GoalSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate();
  if (update.targetAmount && update.durationMonths) {
    update.monthlyDeduction = Math.round(update.targetAmount / update.durationMonths);
  }
});

module.exports = mongoose.model('Goal', GoalSchema);
