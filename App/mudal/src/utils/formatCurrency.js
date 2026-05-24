/**
 * Format a number as currency string
 * @param {number} amount
 * @param {string} currency - Currency code (LKR, USD, EUR, GBP)
 * @param {boolean} showSign - Whether to prefix +/- sign
 */
export const formatCurrency = (amount, currency = 'LKR', showSign = false) => {
  const symbols = {
    LKR: 'Rs.',
    USD: '$',
    EUR: '\u20AC',
    GBP: '\u00A3',
    INR: '\u20B9',
  };

  const symbol = symbols[currency] || currency + ' ';
  const absAmount = Math.abs(amount);

  let formatted;
  if (absAmount >= 1000000) {
    formatted = (absAmount / 1000000).toFixed(2) + 'M';
  } else if (absAmount >= 100000) {
    formatted = absAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  } else {
    formatted = absAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  const sign = showSign ? (amount >= 0 ? '+' : '-') : amount < 0 ? '-' : '';
  return `${sign}${symbol}${formatted}`;
};

/**
 * Compact currency format for tight spaces
 */
export const formatCompact = (amount, currency = 'LKR') => {
  const symbols = { LKR: 'Rs.', USD: '$', EUR: '\u20AC', GBP: '\u00A3', INR: '\u20B9' };
  const symbol = symbols[currency] || currency + ' ';
  const abs = Math.abs(amount);

  if (abs >= 1000000) return `${symbol}${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${symbol}${(abs / 1000).toFixed(1)}K`;
  return `${symbol}${abs.toFixed(0)}`;
};
