export const mockTransactions = [
  { id: '1', date: '2026-03-01', amount: 8000, category: 'Pocket Money', type: 'income', description: 'Monthly allowance from home' },
  { id: '2', date: '2026-03-05', amount: 15000, category: 'Stipend', type: 'income', description: 'Winter Internship Stipend' },
  { id: '3', date: '2026-03-10', amount: 120, category: 'Canteen & Dining', type: 'expense', description: 'Masala Dosa & Chai at Canteen' },
  { id: '4', date: '2026-03-12', amount: 500, category: 'Transport', type: 'expense', description: 'Metro Card Recharge' },
  { id: '5', date: '2026-03-15', amount: 450, category: 'Groceries', type: 'expense', description: 'Blinkit - Snacks & Beverages' },
  { id: '6', date: '2026-03-18', amount: 59, category: 'Entertainment', type: 'expense', description: 'Spotify Premium Student Plan' },
  { id: '7', date: '2026-03-22', amount: 3500, category: 'Shopping', type: 'expense', description: 'Amazon - New Headphones' },
  { id: '8', date: '2026-03-25', amount: 200, category: 'Education', type: 'expense', description: 'Photocopies & Lab Manuals' },
  { id: '9', date: '2026-03-28', amount: 850, category: 'Canteen & Dining', type: 'expense', description: 'UPI to Roommate - Dinner Outing' },
  { id: '10', date: '2026-04-01', amount: 5000, category: 'Freelance', type: 'income', description: 'Logo Design Project' },
  { id: '11', date: '2026-04-02', amount: 120, category: 'Transport', type: 'expense', description: 'Auto-rickshaw to College' },
  { id: '12', date: '2026-04-03', amount: 150, category: 'Canteen & Dining', type: 'expense', description: 'Maggie & Cold Coffee' }
];

export const CATEGORIES = {
  expense: ['Canteen & Dining', 'Transport', 'Education', 'Groceries', 'Entertainment', 'Shopping', 'Other'],
  income: ['Pocket Money', 'Stipend', 'Freelance', 'Other']
};
