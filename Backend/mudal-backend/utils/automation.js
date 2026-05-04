const Transaction = require('../models/Transaction');
const Recurring = require('../models/Recurring');
const User = require('../models/User');
const Goal = require('../models/Goal');

const processAutomation = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Process Auto-Salary
    if (user.salarySettings?.autoAdd && user.salarySettings?.payday) {
      const payDay = user.salarySettings.payday;
      const today = now.getDate();

      if (today >= payDay) {
        // Check if salary for this month already added
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

        const salaryExists = await Transaction.findOne({
          user: userId,
          title: 'Monthly Salary',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        if (!salaryExists) {
          const salaryTx = new Transaction({
            title: 'Monthly Salary',
            amount: user.monthlySalary || 0,
            type: 'income',
            category: { name: 'Salary', icon: 'salary', color: '#4CAF50' },
            date: new Date(currentYear, currentMonth, payDay),
            user: userId,
          });
          await salaryTx.save();

          // Deduct for active goals
          const activeGoals = await Goal.find({ user: userId, status: 'active' });
          for (const goal of activeGoals) {
            const deduction = goal.monthlyDeduction;
            
            // Create deduction transaction
            const goalTx = new Transaction({
              title: `Goal Contribution: ${goal.title}`,
              amount: deduction,
              type: 'expense',
              category: goal.category,
              date: new Date(currentYear, currentMonth, payDay),
              user: userId,
            });
            await goalTx.save();

            // Update goal progress
            goal.currentAmount += deduction;
            if (goal.currentAmount >= goal.targetAmount) {
              goal.status = 'completed';
            }
            await goal.save();
          }
        }
      }
    }

    // 2. Process Recurring Transactions
    const dueRecurring = await Recurring.find({
      user: userId,
      isActive: true,
      nextDueDate: { $lte: now },
    });

    for (const item of dueRecurring) {
      // Create transaction
      const tx = new Transaction({
        title: item.title,
        amount: item.amount,
        type: item.type,
        category: item.category,
        date: item.nextDueDate,
        user: userId,
        isRecurring: true,
        recurringId: item._id,
      });
      await tx.save();

      // Update recurring item
      const nextDate = new Date(item.nextDueDate);
      switch (item.frequency) {
        case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
        case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
        case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
        case 'yearly': nextDate.setFullYear(nextDate.getFullYear() + 1); break;
      }
      
      item.lastProcessedDate = now;
      item.nextDueDate = nextDate;
      await item.save();
    }
  } catch (err) {
    console.error('Automation Error:', err);
  }
};

module.exports = { processAutomation };
