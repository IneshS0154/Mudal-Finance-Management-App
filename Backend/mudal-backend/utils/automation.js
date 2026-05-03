const Transaction = require('../models/Transaction');
const User = require('../models/User');

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
        }
      }
    }
  } catch (err) {
    console.error('Automation Error:', err);
  }
};

module.exports = { processAutomation };
