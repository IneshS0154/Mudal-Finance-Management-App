const Transaction = require('../models/Transaction');

// @desc    Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a transaction
const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    const categoryObj = category && typeof category === 'object'
      ? { _id: category._id || null, name: category.name || '', icon: category.icon || 'other', color: category.color || '#A0A0A0' }
      : { _id: category || null, name: '', icon: 'other', color: '#A0A0A0' };

    const newTransaction = new Transaction({
      title,
      amount,
      type,
      category: categoryObj,
      date: date || new Date(),
      notes: notes || '',
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    const item = await Transaction.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Transaction not found' });

    if (title !== undefined) item.title = title;
    if (amount !== undefined) item.amount = amount;
    if (type !== undefined) item.type = type;
    if (category !== undefined) {
      item.category = category && typeof category === 'object'
        ? { _id: category._id || null, name: category.name || '', icon: category.icon || 'other', color: category.color || '#A0A0A0' }
        : { _id: category || null, name: '', icon: 'other', color: '#A0A0A0' };
    }
    if (date !== undefined) item.date = new Date(date);
    if (notes !== undefined) item.notes = notes;

    const saved = await item.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const item = await Transaction.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
