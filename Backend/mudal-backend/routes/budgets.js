const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
} = require('../controllers/budgetController');

const router = express.Router();

router.use(protect);

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
