import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Award, DollarSign, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { formatCurrency, formatMonth } from '../../utils/formatters';

export default function InsightsPanel() {
  const { transactions } = useApp();

  const insights = useMemo(() => {
    if (!transactions.length) return null;

    // Category spending
    const catSpending = {};
    const catIncome = {};
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        catSpending[t.category] = (catSpending[t.category] || 0) + t.amount;
      } else {
        catIncome[t.category] = (catIncome[t.category] || 0) + t.amount;
      }
    });

    // Top spending category
    const topCat = Object.entries(catSpending).sort(([, a], [, b]) => b - a)[0];
    const topCatInfo = topCat ? CATEGORIES[topCat[0]] : null;

    // Monthly data
    const monthMap = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0, date: d };
      if (t.type === 'income') monthMap[key].income += t.amount;
      else monthMap[key].expenses += t.amount;
    });

    const monthlyData = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, val]) => ({
        name: formatMonth(val.date),
        income: Math.round(val.income),
        expenses: Math.round(val.expenses),
        net: Math.round(val.income - val.expenses),
      }));

    // Month-over-month expense change
    const months = Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b));
    let expenseChange = 0;
    if (months.length >= 2) {
      const current = months[months.length - 1][1].expenses;
      const previous = months[months.length - 2][1].expenses;
      expenseChange = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    }

    // Average daily spending
    const totalExpenses = Object.values(catSpending).reduce((s, v) => s + v, 0);
    const dayRange = Math.max(1, Math.ceil(
      (new Date() - new Date(Math.min(...transactions.map((t) => new Date(t.date))))) /
        (1000 * 60 * 60 * 24)
    ));
    const avgDaily = totalExpenses / dayRange;

    // Income vs expense ratio
    const totalIncome = Object.values(catIncome).reduce((s, v) => s + v, 0);
    const ratio = totalExpenses > 0 ? totalIncome / totalExpenses : 0;

    // Category breakdown for top 5
    const topCategories = Object.entries(catSpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([key, val]) => ({
        category: key,
        amount: val,
        info: CATEGORIES[key],
        percentage: ((val / totalExpenses) * 100).toFixed(1),
      }));

    return {
      topCat: topCat ? { key: topCat[0], amount: topCat[1], info: topCatInfo } : null,
      monthlyData,
      expenseChange,
      avgDaily,
      totalIncome,
      totalExpenses,
      ratio,
      topCategories,
    };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="card" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-tertiary)' }}>Add transactions to see insights.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ color: entry.color, fontSize: '0.8125rem', margin: '4px 0' }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Insight Cards Row */}
      <div className="insights-grid">
        {/* Top Spending Category */}
        <div className="insight-card animate-fadeInUp stagger-1">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Award size={18} style={{ color: 'var(--brand-accent)' }} />
            <span className="insight-label">Highest Spending</span>
          </div>
          {insights.topCat && (
            <>
              <div className="insight-value" style={{ color: insights.topCat.info?.color }}>
                {insights.topCat.info?.emoji} {insights.topCat.info?.label}
              </div>
              <div className="insight-detail">
                {formatCurrency(insights.topCat.amount)} total spent
              </div>
            </>
          )}
        </div>

        {/* Monthly Trend */}
        <div className="insight-card animate-fadeInUp stagger-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            {insights.expenseChange <= 0 ? (
              <TrendingDown size={18} style={{ color: 'var(--color-income)' }} />
            ) : (
              <TrendingUp size={18} style={{ color: 'var(--color-expense)' }} />
            )}
            <span className="insight-label">Spending Trend</span>
          </div>
          <div
            className="insight-value"
            style={{
              color: insights.expenseChange <= 0 ? 'var(--color-income)' : 'var(--color-expense)',
            }}
          >
            {insights.expenseChange <= 0 ? '↓' : '↑'} {Math.abs(insights.expenseChange).toFixed(1)}%
          </div>
          <div className="insight-detail">
            {insights.expenseChange <= 0 ? 'Less' : 'More'} spending than last month
          </div>
        </div>

        {/* Average Daily */}
        <div className="insight-card animate-fadeInUp stagger-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <DollarSign size={18} style={{ color: 'var(--brand-secondary)' }} />
            <span className="insight-label">Daily Average</span>
          </div>
          <div className="insight-value" style={{ color: 'var(--brand-secondary)' }}>
            {formatCurrency(insights.avgDaily)}
          </div>
          <div className="insight-detail">
            Average daily spending
          </div>
        </div>
      </div>

      {/* Secondary Insights */}
      <div className="insights-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        {/* Income/Expense Ratio */}
        <div className="insight-card animate-fadeInUp stagger-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <PieChartIcon size={18} style={{ color: 'var(--brand-primary-light)' }} />
            <span className="insight-label">Income to Expense Ratio</span>
          </div>
          <div className="insight-value" style={{ color: insights.ratio >= 1 ? 'var(--color-income)' : 'var(--color-expense)' }}>
            {insights.ratio.toFixed(2)}x
          </div>
          <div className="insight-detail">
            {insights.ratio >= 1 ? 'You earn more than you spend' : 'You spend more than you earn'}
          </div>
        </div>

        {/* Total Savings */}
        <div className="insight-card animate-fadeInUp stagger-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <BarChart3 size={18} style={{ color: 'var(--color-income)' }} />
            <span className="insight-label">Net Savings</span>
          </div>
          <div
            className="insight-value"
            style={{
              color: insights.totalIncome - insights.totalExpenses >= 0
                ? 'var(--color-income)'
                : 'var(--color-expense)',
            }}
          >
            {formatCurrency(insights.totalIncome - insights.totalExpenses)}
          </div>
          <div className="insight-detail">
            Total income minus expenses
          </div>
        </div>

        {/* Top Categories Breakdown */}
        <div className="insight-card animate-fadeInUp stagger-4">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Award size={18} style={{ color: 'var(--brand-accent)' }} />
            <span className="insight-label">Top Expense Categories</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {insights.topCategories.map((cat) => (
              <div
                key={cat.category}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span style={{ fontSize: 'var(--font-md)' }}>{cat.info?.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'var(--font-xs)',
                      marginBottom: 3,
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {cat.info?.label}
                    </span>
                    <span style={{ color: 'var(--text-tertiary)' }}>{cat.percentage}%</span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: 'var(--bg-tertiary)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${cat.percentage}%`,
                        background: cat.info?.color,
                        borderRadius: 2,
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Comparison Chart */}
      <div className="chart-card animate-fadeInUp stagger-4">
        <div className="card-header">
          <div>
            <div className="card-title">Monthly Comparison</div>
            <div className="card-subtitle">Income vs Expenses over time</div>
          </div>
        </div>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={insights.monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }}
              />
              <Bar
                dataKey="income"
                fill="#10b981"
                name="Income"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
              <Bar
                dataKey="expenses"
                fill="#f43f5e"
                name="Expenses"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
                animationBegin={200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
