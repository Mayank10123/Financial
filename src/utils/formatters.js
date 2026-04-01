import { CATEGORIES } from '../data/categories';

// Format currency
export const formatCurrency = (amount, showSign = false) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (showSign && amount > 0) return `+${formatted}`;
  if (showSign && amount < 0) return `-${formatted}`;
  return formatted;
};

// Format date
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Format date short (for charts)
export const formatDateShort = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Format month
export const formatMonth = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

// Get category info
export const getCategoryInfo = (categoryKey) => {
  return CATEGORIES[categoryKey] || { label: categoryKey, color: '#64748b', emoji: '📦' };
};

// Format percentage
export const formatPercent = (value) => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Get greeting based on time
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// Compact number formatting
export const formatCompact = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};
