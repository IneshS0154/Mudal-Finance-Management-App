const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const DEFAULT_CATEGORIES = [
  { name: 'Food', icon: 'food', color: '#FF6B6B', type: 'expense' },
  { name: 'Travel', icon: 'travel', color: '#4ECDC4', type: 'expense' },
  { name: 'Shopping', icon: 'shopping', color: '#FFE66D', type: 'expense' },
  { name: 'Entertainment', icon: 'entertainment', color: '#A66CFF', type: 'expense' },
  { name: 'Healthcare', icon: 'healthcare', color: '#49B6FF', type: 'expense' },
  { name: 'Education', icon: 'education', color: '#FF9F43', type: 'expense' },
  { name: 'Utilities', icon: 'utilities', color: '#54A0FF', type: 'expense' },
  { name: 'Rent', icon: 'rent', color: '#5F27CD', type: 'expense' },
  { name: 'Groceries', icon: 'groceries', color: '#10AC84', type: 'expense' },
  { name: 'Transport', icon: 'transport', color: '#01A3A4', type: 'expense' },
  { name: 'Clothing', icon: 'clothing', color: '#EE5A24', type: 'expense' },
  { name: 'Subscriptions', icon: 'subscriptions', color: '#6C5CE7', type: 'expense' },
  { name: 'Salary', icon: 'salary', color: '#34C759', type: 'income' },
  { name: 'Freelance', icon: 'freelance', color: '#00B894', type: 'income' },
  { name: 'Bonus', icon: 'bonus', color: '#FDCB6E', type: 'income' },
  { name: 'Refund', icon: 'refund', color: '#81ECEC', type: 'income' },
  { name: 'Interest', icon: 'interest', color: '#74B9FF', type: 'income' },
  { name: 'Other', icon: 'other', color: '#B2BEC3', type: 'income' },
];

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const register = async (req, res) => {
  try {
    const { name, email, password, currency } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      currency: (currency || 'LKR').trim(),
      categories: DEFAULT_CATEGORIES,
    });

    const token = signToken(user._id);
    const safe = user.toJSON();
    res.status(201).json({ token, user: safe });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    if (err.name === 'ValidationError') {
      const first = Object.values(err.errors || {})[0];
      return res.status(400).json({ message: first?.message || 'Invalid registration data' });
    }
    res.status(500).json({ message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    const safe = user.toJSON();
    res.json({ token, user: safe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { register, login };
