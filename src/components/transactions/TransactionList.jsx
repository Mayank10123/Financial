import { useState, useMemo, useCallback } from 'react';
import { Plus, Download, ChevronUp, ChevronDown, FileText, FileJson } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/categories';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportAsCSV, exportAsJSON } from '../../utils/exportData';
import TransactionFilters from './TransactionFilters';
import TransactionForm from './TransactionForm';
import EmptyState from '../shared/EmptyState';

const PAGE_SIZE = 10;

export default function TransactionList() {
  const { role, filters, setFilter, getFilteredTransactions, deleteTransaction } = useApp();
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filtered = useMemo(() => getFilteredTransactions(), [getFilteredTransactions]);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPageNum - 1) * PAGE_SIZE, currentPageNum * PAGE_SIZE);

  const handleSort = useCallback((field) => {
    setFilter({
      sortBy: field,
      sortOrder: filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc',
    });
  }, [filters.sortBy, filters.sortOrder, setFilter]);

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return null;
    return filters.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const handleEdit = (txn) => {
    setEditingTxn(txn);
    setFormOpen(true);
  };

  const handleDelete = async (txn) => {
    if (window.confirm(`Delete "${txn.description}"?`)) {
      await deleteTransaction(txn.id);
    }
  };

  const handleExport = (format) => {
    if (format === 'csv') exportAsCSV(filtered);
    else exportAsJSON(filtered);
    setShowExportMenu(false);
  };

  return (
    <div>
      {/* Actions bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <div>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-sm)' }}>
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', position: 'relative' }}>
          {/* Export */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              id="export-btn"
            >
              <Download size={14} /> Export
            </button>
            {showExportMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 4,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 10,
                  minWidth: 160,
                  animation: 'fadeInDown 0.15s ease',
                }}
              >
                <button
                  className="nav-item"
                  onClick={() => handleExport('csv')}
                  id="export-csv"
                  style={{ width: '100%' }}
                >
                  <FileText size={16} /> Export as CSV
                </button>
                <button
                  className="nav-item"
                  onClick={() => handleExport('json')}
                  id="export-json"
                  style={{ width: '100%' }}
                >
                  <FileJson size={16} /> Export as JSON
                </button>
              </div>
            )}
          </div>

          {/* Add (Admin only) */}
          {role === 'admin' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => { setEditingTxn(null); setFormOpen(true); }}
              id="add-txn-btn"
            >
              <Plus size={14} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      <TransactionFilters />

      {/* Table */}
      {paginated.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No transactions found"
            message="Try adjusting your filters or add a new transaction."
          />
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('description')} className={filters.sortBy === 'description' ? 'sorted' : ''}>
                    Transaction <SortIcon field="description" />
                  </th>
                  <th onClick={() => handleSort('date')} className={filters.sortBy === 'date' ? 'sorted' : ''}>
                    Date <SortIcon field="date" />
                  </th>
                  <th onClick={() => handleSort('category')} className={filters.sortBy === 'category' ? 'sorted' : ''}>
                    Category <SortIcon field="category" />
                  </th>
                  <th>Type</th>
                  <th onClick={() => handleSort('amount')} className={filters.sortBy === 'amount' ? 'sorted' : ''} style={{ textAlign: 'right' }}>
                    Amount <SortIcon field="amount" />
                  </th>
                  {role === 'admin' && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map((txn) => {
                  const cat = CATEGORIES[txn.category] || {};
                  return (
                    <tr key={txn.id}>
                      <td>
                        <div className="txn-description">
                          <div className="txn-cat-icon" style={{ background: `${cat.color}18` }}>
                            {cat.emoji || '📦'}
                          </div>
                          <div>
                            <div className="txn-name">{txn.description}</div>
                            <div className="txn-cat-label">{cat.label || txn.category}</div>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(txn.date)}</td>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: 'var(--font-xs)',
                            fontWeight: 600,
                            background: `${cat.color}18`,
                            color: cat.color,
                          }}
                        >
                          {cat.emoji} {cat.label || txn.category}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${txn.type}`}>
                          {txn.type === 'income' ? '↗ Income' : '↘ Expense'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={`txn-amount ${txn.type}`}>
                          {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                        </span>
                      </td>
                      {role === 'admin' && (
                        <td style={{ textAlign: 'right' }}>
                          <div className="txn-actions" style={{ opacity: 1, justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleEdit(txn)}
                              style={{ fontSize: 'var(--font-xs)' }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleDelete(txn)}
                              style={{ fontSize: 'var(--font-xs)', color: 'var(--color-expense)' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPageNum === 1}
                onClick={() => setCurrentPageNum((p) => p - 1)}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={p === currentPageNum ? 'active' : ''}
                  onClick={() => setCurrentPageNum(p)}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPageNum === totalPages}
                onClick={() => setCurrentPageNum((p) => p + 1)}
              >
                ›
              </button>
            </div>
          )}
        </div>
      )}

      {/* Form modal */}
      <TransactionForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingTxn(null); }}
        editData={editingTxn}
      />
    </div>
  );
}
