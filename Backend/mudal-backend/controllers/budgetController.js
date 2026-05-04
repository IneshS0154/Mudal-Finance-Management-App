const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// ─── GET all budgets for current month ────────────────────────────────────────
const getAllBudgets = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const budgets = await Budget.find({ user: req.user.id, month, year }).sort({ createdAt: -1 });
    
    // Calculate spent amounts from transactions for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);
        
        const spent = await Transaction.aggregate([
          {
            $match: {
              user: req.user._id,
              'category._id': budget.category._id,
              type: 'expense',
              date: { $gte: startOfMonth, $lte: endOfMonth },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        
        const spentAmount = spent.length > 0 ? spent[0].total : 0;
        
        // Update spent if it changed
        if (budget.spent !== spentAmount) {
          budget.spent = spentAmount;
          await budget.save();
        }
        
        return budget;
      })
    );
    
    res.json(budgetsWithSpent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET single budget ────────────────────────────────────────────────────────
const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found or not authorized' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── POST create new budget ───────────────────────────────────────────────────
const createBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;

    // Handle category as object or string
    const categoryObj = category && typeof category === 'object'
      ? { _id: category._id || category.id, name: category.name || '', icon: category.icon || 'other', color: category.color || '#A0A0A0' }
      : { _id: category || '', name: '', icon: 'other', color: '#A0A0A0' };

    const now = new Date();
    const budgetMonth = month || now.getMonth() + 1;
    const budgetYear = year || now.getFullYear();

    // Check if budget already exists for this category/month/year for this user
    const existing = await Budget.findOne({
      user: req.user.id,
      'category._id': categoryObj._id,
      month: budgetMonth,
      year: budgetYear,
    });

    if (existing) {
      return res.status(400).json({ message: 'Budget already exists for this category and month' });
    }

    const budget = new Budget({
      category: categoryObj,
      limit,
      spent: 0,
      month: budgetMonth,
      year: budgetYear,
      user: req.user.id,
    });

    // Recalculate spent for this month/category
    const startOfMonth = new Date(budgetYear, budgetMonth - 1, 1);
    const endOfMonth = new Date(budgetYear, budgetMonth, 0, 23, 59, 59);
    
    const spentData = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          'category._id': categoryObj._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    budget.spent = spentData.length > 0 ? spentData[0].total : 0;

    const saved = await budget.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ─── PUT update budget ────────────────────────────────────────────────────────
const updateBudget = async (req, res) => {
  try {
    const { category, limit, spent } = req.body;

    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found or not authorized' });

    if (category !== undefined) {
      budget.category = category && typeof category === 'object'
        ? { _id: category._id || category.id, name: category.name || '', icon: category.icon || 'other', color: category.color || '#A0A0A0' }
        : { _id: category || '', name: '', icon: 'other', color: '#A0A0A0' };
    }
    if (limit !== undefined) budget.limit = limit;

    // Recalculate spent
    const startOfMonth = new Date(budget.year, budget.month - 1, 1);
    const endOfMonth = new Date(budget.year, budget.month, 0, 23, 59, 59);
    
    const spentData = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          'category._id': budget.category._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    budget.spent = spentData.length > 0 ? spentData[0].total : 0;

    const saved = await budget.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ─── DELETE budget ────────────────────────────────────────────────────────────
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ message: 'Budget not found or not authorized' });
    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
};
