// Category definitions with colors and emoji icons
export const CATEGORIES = {
  food: { label: 'Food & Dining', color: '#f97316', emoji: '🍔', type: 'expense' },
  transport: { label: 'Transport', color: '#3b82f6', emoji: '🚗', type: 'expense' },
  entertainment: { label: 'Entertainment', color: '#a855f7', emoji: '🎬', type: 'expense' },
  shopping: { label: 'Shopping', color: '#ec4899', emoji: '🛍️', type: 'expense' },
  bills: { label: 'Bills & Utilities', color: '#ef4444', emoji: '📄', type: 'expense' },
  health: { label: 'Health', color: '#14b8a6', emoji: '💊', type: 'expense' },
  education: { label: 'Education', color: '#8b5cf6', emoji: '📚', type: 'expense' },
  travel: { label: 'Travel', color: '#f43f5e', emoji: '✈️', type: 'expense' },
  other_expense: { label: 'Other', color: '#64748b', emoji: '📦', type: 'expense' },
  salary: { label: 'Salary', color: '#22c55e', emoji: '💰', type: 'income' },
  freelance: { label: 'Freelance', color: '#06b6d4', emoji: '💻', type: 'income' },
  investments: { label: 'Investments', color: '#eab308', emoji: '📈', type: 'income' },
  other_income: { label: 'Other Income', color: '#64748b', emoji: '💵', type: 'income' },
};

export const EXPENSE_CATEGORIES = Object.entries(CATEGORIES)
  .filter(([, v]) => v.type === 'expense')
  .map(([key]) => key);

export const INCOME_CATEGORIES = Object.entries(CATEGORIES)
  .filter(([, v]) => v.type === 'income')
  .map(([key]) => key);

export const ALL_CATEGORIES = Object.keys(CATEGORIES);
