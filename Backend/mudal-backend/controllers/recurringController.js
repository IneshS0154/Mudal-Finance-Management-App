const Recurring = require('../models/Recurring');

// ─── GET all recurring transactions ──────────────────────────────────────────
const getAllRecurring = async (req, res) => {
  try {
    const items = await Recurring.find().sort({ nextDueDate: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET single recurring transaction ────────────────────────────────────────
const getRecurringById = async (req, res) => {
  try {
    const item = await Recurring.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Recurring transaction not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── POST create new recurring transaction ────────────────────────────────────
const createRecurring = async (req, res) => {
  console.log('POST /api/recurring called, body:', JSON.stringify(req.body));
  try {
    const { title, amount, frequency, type, category, startDate } = req.body;

    // category may arrive as the full object { _id, name, icon, color } from the app
    const categoryObj = category && typeof category === 'object'
      ? { _id: category._id || null, name: category.name || '', icon: category.icon || 'other', color: category.color || '#A0A0A0' }
      : { _id: category || null, name: '', icon: 'other', color: '#A0A0A0' };

    const startD = startDate ? new Date(startDate) : new Date();

    const item = new Recurring({
      title,
      amount,
      type: type || 'expense',
      frequency: frequency || 'monthly',
      category: categoryObj,
      startDate: startD,
      // nextDueDate will be calculated by the pre-save hook
    });

    const saved = await item.save();
    console.log('Saved recurring to DB:', saved._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error('POST /api/recurring error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

// ─── PUT update recurring transaction ────────────────────────────────────────
const updateRecurring = async (req, res) => {
  try {
    const { title, amount, frequency, type, category, startDate, isActive } = req.body;

    const item = await Recurring.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Recurring transaction not found' });

    if (title !== undefined) item.title = title;
    if (amount !== undefined) item.amount = amount;
    if (frequency !== undefined) item.frequency = frequency;
    if (type !== undefined) item.type = type;
    if (category !== undefined) {
      item.category = category && typeof category === 'object'
        ? { _id: category._id || null, name: category.name || '', icon: category.icon || 'other', color: category.color || '#A0A0A0' }
        : { _id: category || null, name: '', icon: 'other', color: '#A0A0A0' };
    }
    if (startDate !== undefined) {
      item.startDate = new Date(startDate);
    }
    if (isActive !== undefined) item.isActive = isActive;

    // item.save() will trigger the pre-save hook to recalculate nextDueDate
    const saved = await item.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ─── DELETE recurring transaction ────────────────────────────────────────────
const deleteRecurring = async (req, res) => {
  try {
    const item = await Recurring.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Recurring transaction not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllRecurring,
  getRecurringById,
  createRecurring,
  updateRecurring,
  deleteRecurring,
};
