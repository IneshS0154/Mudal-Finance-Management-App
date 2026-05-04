const express = require('express');
const router = express.Router();
const {
  getAllRecurring,
  getRecurringById,
  createRecurring,
  updateRecurring,
  deleteRecurring,
} = require('../controllers/recurringController');

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
