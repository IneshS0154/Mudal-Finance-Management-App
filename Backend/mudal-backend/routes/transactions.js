const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

// @route   GET /api/transactions
// @desc    Get all transactions
router.get('/', getAllTransactions);

// @route   POST /api/transactions
// @desc    Create a transaction
router.post('/', createTransaction);

// @route   PUT /api/transactions/:id
// @desc    Update a transaction
router.put('/:id', updateTransaction);

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
router.delete('/:id', deleteTransaction);

module.exports = router;
