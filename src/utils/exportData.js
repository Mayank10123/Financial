import { CATEGORIES } from '../data/categories';
import { formatCurrency } from './formatters';

// Export transactions as CSV
export const exportAsCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((t) => {
    const catInfo = CATEGORIES[t.category] || { label: t.category };
    return [
      new Date(t.date).toLocaleDateString('en-US'),
      `"${t.description}"`,
      catInfo.label,
      t.type,
      t.amount.toFixed(2),
    ];
  });

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csv, 'transactions.csv', 'text/csv');
};

// Export transactions as JSON
export const exportAsJSON = (transactions) => {
  const data = transactions.map((t) => ({
    date: new Date(t.date).toISOString(),
    description: t.description,
    category: t.category,
    type: t.type,
    amount: t.amount,
  }));

  const json = JSON.stringify(data, null, 2);
  downloadFile(json, 'transactions.json', 'application/json');
};

// Helper: trigger file download
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate summary report as text
export const generateReport = (transactions) => {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;

  return `
Financial Summary Report
========================
Generated: ${new Date().toLocaleDateString('en-US')}

Total Income:   ${formatCurrency(income)}
Total Expenses: ${formatCurrency(expenses)}
Net Balance:    ${formatCurrency(balance)}

Total Transactions: ${transactions.length}
  `.trim();
};
