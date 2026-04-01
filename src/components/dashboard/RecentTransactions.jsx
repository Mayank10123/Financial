import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { formatCurrency, formatDate } from '../../utils/formatters';
import EmptyState from '../shared/EmptyState';

export default function RecentTransactions() {
  const { transactions, setPage } = useApp();

  const recent = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  if (recent.length === 0) {
    return (
      <div className="card animate-fadeInUp stagger-4">
        <EmptyState title="No transactions yet" message="Add your first transaction to get started." />
      </div>
    );
  }

  return (
    <div className="card animate-fadeInUp stagger-4">
      <div className="card-header">
        <div>
          <div className="card-title">Recent Transactions</div>
          <div className="card-subtitle">Last 5 transactions</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setPage('transactions')}>
          View All <ArrowRight size={14} />
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Date</th>
              <th>Category</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((txn) => {
              const cat = CATEGORIES[txn.category] || {};
              return (
                <tr key={txn.id}>
                  <td>
                    <div className="txn-description">
                      <div
                        className="txn-cat-icon"
                        style={{ background: `${cat.color}18` }}
                      >
                        {cat.emoji || '📦'}
                      </div>
                      <span className="txn-name">{txn.description}</span>
                    </div>
                  </td>
                  <td>{formatDate(txn.date)}</td>
                  <td>
                    <span className={`badge badge-${txn.type}`}>
                      {cat.label || txn.category}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`txn-amount ${txn.type}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
