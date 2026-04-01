import { Search, Filter, X, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, ALL_CATEGORIES } from '../../data/categories';

export default function TransactionFilters() {
  const { filters, setFilter, resetFilters } = useApp();

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="filters-bar animate-fadeInUp">
      {/* Search */}
      <div className="filter-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search by description..."
          value={filters.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          id="txn-search"
        />
        {filters.search && (
          <button
            className="btn-icon btn-ghost"
            onClick={() => setFilter({ search: '' })}
            style={{ width: 24, height: 24 }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Type filter pills */}
      <div className="filter-group">
        <label>Type</label>
        <div className="filter-pills">
          {['all', 'income', 'expense'].map((type) => (
            <button
              key={type}
              className={`filter-pill ${filters.type === type ? 'active' : ''}`}
              onClick={() => setFilter({ type })}
              id={`filter-type-${type}`}
            >
              {type === 'all' ? 'All' : type === 'income' ? '↗ Income' : '↘ Expense'}
            </button>
          ))}
        </div>
      </div>

      {/* Category dropdown */}
      <div className="filter-group">
        <label>Category</label>
        <select
          className="form-select"
          value={filters.category}
          onChange={(e) => setFilter({ category: e.target.value })}
          id="filter-category"
          style={{ minWidth: 140 }}
        >
          <option value="all">All Categories</option>
          <optgroup label="Expenses">
            {ALL_CATEGORIES
              .filter((k) => CATEGORIES[k].type === 'expense')
              .map((k) => (
                <option key={k} value={k}>
                  {CATEGORIES[k].emoji} {CATEGORIES[k].label}
                </option>
              ))}
          </optgroup>
          <optgroup label="Income">
            {ALL_CATEGORIES
              .filter((k) => CATEGORIES[k].type === 'income')
              .map((k) => (
                <option key={k} value={k}>
                  {CATEGORIES[k].emoji} {CATEGORIES[k].label}
                </option>
              ))}
          </optgroup>
        </select>
      </div>

      {/* Date range */}
      <div className="filter-group">
        <label><Calendar size={12} style={{ verticalAlign: 'middle' }} /> Date Range</label>
        <div className="date-range-picker">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilter({ dateFrom: e.target.value })}
            id="filter-date-from"
          />
          <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)' }}>to</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilter({ dateTo: e.target.value })}
            id="filter-date-to"
          />
        </div>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <div className="filters-actions">
          <button className="btn btn-ghost btn-sm" onClick={resetFilters} id="clear-filters">
            <X size={14} /> Clear
          </button>
        </div>
      )}
    </div>
  );
}
