const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    icon: { type: String, default: 'other' },
    color: { type: String, default: '#B2BEC3' },
    type: { type: String, enum: ['expense', 'income'], required: true },
  },
  { _id: true }
);

const salarySettingsSchema = new mongoose.Schema(
  {
    autoAdd: { type: Boolean, default: false },
    payday: { type: Number, min: 1, max: 31, default: 1 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    currency: { type: String, default: 'LKR', trim: true },
    occupation: { type: String, default: '', trim: true },
    phoneNumber: { type: String, default: '', trim: true },
    monthlySalary: { type: Number, default: 0 },
    salarySettings: { type: salarySettingsSchema, default: () => ({}) },
    categories: { type: [categorySchema], default: [] },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
