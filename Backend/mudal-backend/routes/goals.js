const express = require('express');
const auth = require('../middleware/auth');
const {
  getAllGoals,
  getGoalById,
  createGoal,
  contributeToGoal,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');

const router = express.Router();
router.use(auth);

router.get('/', getAllGoals);
router.post('/', createGoal);
router.post('/:id/contribute', contributeToGoal);
router.get('/:id', getGoalById);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
