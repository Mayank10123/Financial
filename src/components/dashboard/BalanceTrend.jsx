import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatMonth } from '../../utils/formatters';

export default function BalanceTrend() {
  const { transactions, theme } = useApp();

  const data = useMemo(() => {
    // Group transactions by month
    const monthMap = {};
    const now = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap[key] = { month: key, income: 0, expenses: 0, date: d };
    }

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap[key]) {
        if (t.type === 'income') monthMap[key].income += t.amount;
        else monthMap[key].expenses += t.amount;
      }
    });

    let runningBalance = 0;
    return Object.values(monthMap)
      .sort((a, b) => a.date - b.date)
      .map((m) => {
        runningBalance += m.income - m.expenses;
        return {
          name: formatMonth(m.date),
          income: Math.round(m.income),
          expenses: Math.round(m.expenses),
          balance: Math.round(runningBalance),
        };
      });
  }, [transactions]);

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
    <div className="chart-card animate-fadeInUp stagger-2">
      <div className="card-header">
        <div>
          <div className="card-title">Balance Trend</div>
          <div className="card-subtitle">Last 6 months overview</div>
        </div>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--chart-grid)"
              vertical={false}
            />
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
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradIncome)"
              name="Income"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#gradExpense)"
              name="Expenses"
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#gradBalance)"
              name="Balance"
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
