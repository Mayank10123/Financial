import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';

export default function SpendingBreakdown() {
  const { transactions } = useApp();

  const data = useMemo(() => {
    const catTotals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
      });

    return Object.entries(catTotals)
      .map(([key, total]) => ({
        name: CATEGORIES[key]?.label || key,
        value: Math.round(total * 100) / 100,
        color: CATEGORIES[key]?.color || '#64748b',
        emoji: CATEGORIES[key]?.emoji || '📦',
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const entry = payload[0];
    const pct = ((entry.value / total) * 100).toFixed(1);
    return (
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          {entry.name}
        </p>
        <p style={{ color: entry.payload.color, fontSize: '0.8125rem' }}>
          {formatCurrency(entry.value)} ({pct}%)
        </p>
      </div>
    );
  };

  return (
    <div className="chart-card animate-fadeInUp stagger-3">
      <div className="card-header">
        <div>
          <div className="card-title">Spending Breakdown</div>
          <div className="card-subtitle">By category</div>
        </div>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 8 }}>
        {data.slice(0, 6).map((item) => (
          <div
            key={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 'var(--font-xs)',
              color: 'var(--text-secondary)',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: item.color,
                flexShrink: 0,
              }}
            />
            <span>{item.emoji} {item.name}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
