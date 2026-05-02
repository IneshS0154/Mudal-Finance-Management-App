// Maps category keys to MaterialCommunityIcons names
// Used for category icons throughout the app

const categoryIcons = {
  food: 'silverware-fork-knife',
  travel: 'car',
  transport: 'bus',
  shopping: 'shopping',
  entertainment: 'movie-open',
  healthcare: 'hospital-box',
  education: 'school',
  utilities: 'flash',
  rent: 'home-city',
  groceries: 'cart',
  fitness: 'dumbbell',
  clothing: 'tshirt-crew',
  electronics: 'laptop',
  gifts: 'gift',
  insurance: 'shield-check',
  investments: 'trending-up',
  subscriptions: 'card-account-details',
  salary: 'cash-multiple',
  freelance: 'briefcase',
  bonus: 'star-circle',
  refund: 'cash-refund',
  interest: 'percent',
  other: 'dots-horizontal-circle',
  water: 'water',
  electricity: 'lightbulb',
  internet: 'wifi',
  phone: 'phone',
  gas: 'gas-station',
  savings: 'piggy-bank',
  charity: 'hand-heart',
  pets: 'paw',
  beauty: 'face-woman-shimmer',
  sports: 'basketball',
  music: 'music',
  books: 'book-open-variant',
  coffee: 'coffee',
  restaurant: 'food-fork-drink',
  goal: 'flag-variant',
};

// Available icons for the category icon picker
const availableIcons = Object.entries(categoryIcons).map(([key, icon]) => ({
  key,
  icon,
  label: key.charAt(0).toUpperCase() + key.slice(1),
}));

export { categoryIcons, availableIcons };
