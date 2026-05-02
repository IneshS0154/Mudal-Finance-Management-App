const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  currency: {
    type: String,
    default: 'LKR',
  },
  monthlySalary: {
    type: Number,
    default: 0,
  },
  salarySettings: {
    autoAdd: { type: Boolean, default: false },
    payday: { type: Number, default: 1 },
  },
  occupation: {
    type: String,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  categories: [
    {
      name: { type: String, required: true },
      icon: { type: String, default: 'help-circle' },
      color: { type: String, default: '#A0A0A0' },
      type: { type: String, enum: ['expense', 'income'], default: 'expense' },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
