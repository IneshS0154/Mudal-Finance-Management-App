const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getAllRecurring,
  getRecurringById,
  createRecurring,
  updateRecurring,
  deleteRecurring,
} = require('../controllers/recurringController');

const router = express.Router();

router.use(protect);

// ─── GET all recurring transactions ──────────────────────────────────────────
router.get('/', getAllRecurring);

// ─── GET single recurring transaction ────────────────────────────────────────
router.get('/:id', getRecurringById);

// ─── POST create new recurring transaction ────────────────────────────────────
router.post('/', createRecurring);

// ─── PUT update recurring transaction ────────────────────────────────────────
router.put('/:id', updateRecurring);

// ─── DELETE recurring transaction ────────────────────────────────────────────
router.delete('/:id', deleteRecurring);

module.exports = router;
