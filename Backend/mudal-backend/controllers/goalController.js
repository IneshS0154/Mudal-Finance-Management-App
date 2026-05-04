const Goal = require('../models/Goal');

// ─── GET all goals for current user ───────────────────────────────────────────
const getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── GET single goal by id ───────────────────────────────────────────────────
const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── POST create new goal ────────────────────────────────────────────────────
const createGoal = async (req, res) => {
  try {
    const { title, targetAmount, deadline, notes } = req.body;
    if (!title || !targetAmount) {
      return res.status(400).json({ message: 'Title and target amount are required' });
    }

    const goal = await Goal.create({
      user: req.user.id,
      title,
      targetAmount,
      deadline: deadline ? new Date(deadline) : undefined,
      notes,
      status: 'active',
    });

    res.status(201).json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PUT update existing goal ─────────────────────────────────────────────────
const updateGoal = async (req, res) => {
  try {
    const updates = { ...req.body };
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── POST add contribution to goal ───────────────────────────────────────────
const contributeToGoal = async (req, res) => {
  try {
    const { amount } = req.body;
    if (amount === undefined || amount === null || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'A valid contribution amount is required' });
    }

    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.currentAmount = (goal.currentAmount || 0) + Number(amount);
    if (goal.targetAmount && goal.currentAmount >= goal.targetAmount) {
      goal.status = 'completed';
    }

    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── DELETE existing goal ────────────────────────────────────────────────────
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllGoals,
  getGoalById,
  createGoal,
  contributeToGoal,
  updateGoal,
  deleteGoal,
};
