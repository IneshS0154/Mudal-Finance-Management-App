const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Format date as "Today, 16:32" / "Yesterday" / "Mar 15"
 */
export const formatRelativeDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((today - target) / (1000 * 60 * 60 * 24));

  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Yesterday, ${time}`;
  if (diff < 7) return `${DAYS[date.getDay()]}, ${time}`;
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
};

/**
 * Format as "Jul 2024"
 */
export const formatMonthYear = (dateStr) => {
  const date = new Date(dateStr);
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Format as "15 March 2024"
 */
export const formatFullDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Format as "Mar 15, 2024"
 */
export const formatShortDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/**
 * Get current month key: "2024-07"
 */
export const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Get days remaining in current month
 */
export const getDaysRemaining = () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
};

export { MONTHS, MONTHS_SHORT, DAYS };
