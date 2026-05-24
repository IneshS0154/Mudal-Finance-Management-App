const cron = require('node-cron');
const Recurring = require('../models/Recurring');
const Transaction = require('../models/Transaction');

/**
 * Advance a date by one period based on frequency using proper calendar math.
 * @param {Date} date
 * @param {string} frequency  'daily' | 'weekly' | 'monthly' | 'yearly'
 * @returns {Date} new date advanced by one period
 */
function advanceDate(date, frequency) {
  const next = new Date(date);
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      next.setMonth(next.getMonth() + 1);
  }
  return next;
}

/**
 * Process all overdue active recurring transactions:
 *  - Create a Transaction document for each overdue period
 *  - Advance nextDueDate forward until it is in the future
 */
async function processRecurringTransactions() {
  try {
    const now = new Date();

    // Find all active recurring items that are due or overdue
    const dueItems = await Recurring.find({
      isActive: true,
      nextDueDate: { $lte: now },
    });

    if (dueItems.length === 0) return;

    console.log(`[Scheduler] Processing ${dueItems.length} overdue recurring transaction(s)...`);

    for (const item of dueItems) {
      let dueDate = new Date(item.nextDueDate);

      // Catch up all missed periods
      while (dueDate <= now) {
        // Auto-create a transaction for this period
        await Transaction.create({
          title: item.title,
          type: item.type,
          amount: item.amount,
          category: item.category,
          date: dueDate,
          notes: `Auto-generated from recurring: ${item.title}`,
          recurringId: item._id,
        });

        console.log(
          `[Scheduler] Created transaction for "${item.title}" (${item.frequency}) on ${dueDate.toISOString()}`
        );

        // Advance to the next period
        dueDate = advanceDate(dueDate, item.frequency);
      }

      // Save the updated nextDueDate — bypass the pre-save hook by using updateOne
      await Recurring.updateOne(
        { _id: item._id },
        { $set: { nextDueDate: dueDate } }
      );

      console.log(
        `[Scheduler] Updated nextDueDate for "${item.title}" to ${dueDate.toISOString()}`
      );
    }
  } catch (err) {
    console.error('[Scheduler] Error processing recurring transactions:', err.message);
  }
}

/**
 * Start the scheduler.
 * Runs every hour at minute 0.
 * Also runs once immediately on startup to catch any overdue items.
 */
function startScheduler() {
  // Run once immediately on server start
  processRecurringTransactions();

  // Then run every hour
  cron.schedule('0 * * * *', () => {
    console.log('[Scheduler] Running recurring transaction check...');
    processRecurringTransactions();
  });

  console.log('[Scheduler] Recurring transaction scheduler started (runs every hour).');
}

module.exports = { startScheduler, processRecurringTransactions };
