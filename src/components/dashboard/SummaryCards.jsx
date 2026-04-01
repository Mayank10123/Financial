import { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AnimatedNumber from '../shared/AnimatedNumber';

export default function SummaryCards() {
  const { transactions } = useApp();

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    // Monthly comparison
    const now = new Date();
    const thisMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const lastMonth = transactions.filter((t) => {
      const d = new Date(t.date);
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
    });

    const thisMonthExpenses = thisMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const lastMonthExpenses = lastMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const thisMonthIncome = thisMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const lastMonthIncome = lastMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

    const expenseChange = lastMonthExpenses > 0
      ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
      : 0;
    const incomeChange = lastMonthIncome > 0
      ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
      : 0;

    return { income, expenses, balance, savingsRate, expenseChange, incomeChange };
  }, [transactions]);

  const cards = [
    {
      key: 'balance',
      label: 'Total Balance',
      value: stats.balance,
      icon: Wallet,
      change: null,
    },
    {
      key: 'income',
      label: 'Total Income',
      value: stats.income,
      icon: TrendingUp,
      change: stats.incomeChange,
      changeLabel: 'vs last month',
    },
    {
      key: 'expenses',
      label: 'Total Expenses',
      value: stats.expenses,
      icon: TrendingDown,
      change: stats.expenseChange,
      changeLabel: 'vs last month',
      invertChange: true,
    },
    {
      key: 'savings',
      label: 'Savings Rate',
      value: stats.savingsRate,
      icon: PiggyBank,
      isSavingsRate: true,
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className={`summary-card ${card.key} animate-fadeInUp stagger-${i + 1}`}
          >
            <div className="summary-card-icon">
              <Icon size={22} />
            </div>
            <div className="summary-card-label">{card.label}</div>
            <div className="summary-card-value">
              {card.isSavingsRate ? (
                <AnimatedNumber value={card.value} prefix="" suffix="%" decimals={1} />
              ) : (
                <AnimatedNumber value={card.value} prefix="$" decimals={2} />
              )}
            </div>
            {card.change !== undefined && card.change !== null && (
              <div
                className={`summary-card-change ${
                  card.invertChange
                    ? card.change <= 0 ? 'positive' : 'negative'
                    : card.change >= 0 ? 'positive' : 'negative'
                }`}
              >
                {card.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(card.change).toFixed(1)}% {card.changeLabel}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
