// Mock API service — simulates network delays and CRUD operations
const DELAY = { min: 200, max: 600 };

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => wait(DELAY.min + Math.random() * (DELAY.max - DELAY.min));

export const mockApi = {
  async fetchTransactions(transactions) {
    await randomDelay();
    return { success: true, data: [...transactions] };
  },

  async addTransaction(transaction) {
    await randomDelay();
    // Simulate server generating an ID
    const newTxn = {
      ...transaction,
      id: String(Date.now()),
      date: new Date(transaction.date),
    };
    return { success: true, data: newTxn };
  },

  async updateTransaction(transaction) {
    await randomDelay();
    return {
      success: true,
      data: { ...transaction, date: new Date(transaction.date) },
    };
  },

  async deleteTransaction(id) {
    await randomDelay();
    return { success: true, data: { id } };
  },

  async exportData(transactions, format = 'csv') {
    await randomDelay();
    if (format === 'csv') {
      return { success: true, data: transactionsToCSV(transactions) };
    }
    return { success: true, data: JSON.stringify(transactions, null, 2) };
  },
};

function transactionsToCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString('en-US'),
    `"${t.description}"`,
    t.category,
    t.type,
    t.amount.toFixed(2),
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
