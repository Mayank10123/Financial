import { CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from './categories';

// Helper: random number in range
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: random date within last N months
const randomDate = (monthsBack = 6) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
  const diff = now.getTime() - start.getTime();
  return new Date(start.getTime() + Math.random() * diff);
};

// Expense descriptions by category
const DESCRIPTIONS = {
  food: ['Grocery Store', 'Restaurant Dinner', 'Coffee Shop', 'Food Delivery', 'Lunch Out', 'Bakery', 'Pizza Night', 'Sushi Takeout'],
  transport: ['Gas Station', 'Uber Ride', 'Bus Pass', 'Car Maintenance', 'Parking Fee', 'Metro Card', 'Toll Fee'],
  entertainment: ['Netflix Subscription', 'Movie Tickets', 'Concert Tickets', 'Gaming Store', 'Spotify Premium', 'Streaming Service', 'Book Purchase'],
  shopping: ['Amazon Purchase', 'Clothing Store', 'Electronics Shop', 'Home Decor', 'Furniture Store', 'Online Order', 'Gift Shop'],
  bills: ['Electricity Bill', 'Internet Bill', 'Phone Bill', 'Water Bill', 'Insurance Premium', 'Rent Payment', 'Gas Bill'],
  health: ['Pharmacy', 'Gym Membership', 'Doctor Visit', 'Dental Checkup', 'Vitamins & Supplements', 'Eye Exam'],
  education: ['Online Course', 'Textbooks', 'Workshop Fee', 'Certification Exam', 'Tutoring Session'],
  travel: ['Hotel Booking', 'Flight Ticket', 'Travel Insurance', 'Vacation Package', 'Airport Taxi'],
  other_expense: ['Miscellaneous', 'ATM Fee', 'Donation', 'Pet Supplies', 'Laundry Service'],
  salary: ['Monthly Salary', 'Salary Deposit', 'Paycheck'],
  freelance: ['Freelance Project', 'Consulting Fee', 'Contract Work', 'Design Project', 'Development Job'],
  investments: ['Stock Dividend', 'Mutual Fund Return', 'Bond Interest', 'Crypto Gain', 'Rental Income'],
  other_income: ['Cash Gift', 'Refund', 'Cashback Reward', 'Prize Money', 'Side Hustle'],
};

// Amount ranges by category
const AMOUNTS = {
  food: [8, 120],
  transport: [5, 80],
  entertainment: [10, 100],
  shopping: [15, 300],
  bills: [30, 250],
  health: [15, 200],
  education: [20, 500],
  travel: [100, 1500],
  other_expense: [5, 100],
  salary: [3000, 5500],
  freelance: [200, 2000],
  investments: [50, 800],
  other_income: [20, 500],
};

// Generate a single transaction
let idCounter = 1;
const generateTransaction = (category, date) => {
  const descs = DESCRIPTIONS[category];
  const [minAmt, maxAmt] = AMOUNTS[category];
  const catInfo = CATEGORIES[category];

  return {
    id: String(idCounter++),
    date: date || randomDate(),
    description: descs[rand(0, descs.length - 1)],
    amount: parseFloat((rand(minAmt * 100, maxAmt * 100) / 100).toFixed(2)),
    category,
    type: catInfo.type,
  };
};

// Generate balanced mock dataset
export const generateMockTransactions = () => {
  idCounter = 1;
  const transactions = [];

  // Generate 6 months of salary (predictable)
  for (let i = 0; i < 6; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    date.setDate(1);
    transactions.push(generateTransaction('salary', date));
  }

  // Generate freelance income (sporadic)
  for (let i = 0; i < 8; i++) {
    transactions.push(generateTransaction('freelance'));
  }

  // Investment returns
  for (let i = 0; i < 5; i++) {
    transactions.push(generateTransaction('investments'));
  }

  // Other income
  for (let i = 0; i < 3; i++) {
    transactions.push(generateTransaction('other_income'));
  }

  // Generate expenses across categories
  const expenseDistribution = {
    food: 18,
    transport: 10,
    entertainment: 8,
    shopping: 10,
    bills: 8,
    health: 5,
    education: 4,
    travel: 3,
    other_expense: 4,
  };

  Object.entries(expenseDistribution).forEach(([cat, count]) => {
    for (let i = 0; i < count; i++) {
      transactions.push(generateTransaction(cat));
    }
  });

  // Sort by date descending
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  return transactions;
};

// Default data
export const defaultTransactions = generateMockTransactions();
