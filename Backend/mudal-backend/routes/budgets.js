const express = require('express');
const router = express.Router();
const {
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');

// ─── GET all budgets (current month) ──────────────────────────────────────────
router.get('/', getAllBudgets);

// ─── GET single budget ────────────────────────────────────────────────────────
router.get('/:id', getBudgetById);

// ─── POST create new budget ───────────────────────────────────────────────────
router.post('/', createBudget);

// ─── PUT update budget ────────────────────────────────────────────────────────
router.put('/:id', updateBudget);

// ─── DELETE budget ────────────────────────────────────────────────────────────
router.delete('/:id', deleteBudget);

module.exports = router;
