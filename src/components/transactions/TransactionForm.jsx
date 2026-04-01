import { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, ALL_CATEGORIES } from '../../data/categories';

const INITIAL_FORM = {
  description: '',
  amount: '',
  category: 'food',
  type: 'expense',
  date: new Date().toISOString().split('T')[0],
};

export default function TransactionForm({ isOpen, onClose, editData = null }) {
  const { addTransaction, updateTransaction } = useApp();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setForm({
        description: editData.description,
        amount: String(editData.amount),
        category: editData.category,
        type: editData.type,
        date: new Date(editData.date).toISOString().split('T')[0],
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [editData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const txnData = {
      ...form,
      amount: parseFloat(form.amount),
      date: new Date(form.date),
    };

    if (editData) {
      await updateTransaction({ ...txnData, id: editData.id });
    } else {
      await addTransaction(txnData);
    }
    onClose();
  };

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-switch category options when type changes
      if (field === 'type') {
        const currentCatType = CATEGORIES[prev.category]?.type;
        if (currentCatType !== value) {
          const firstCat = ALL_CATEGORIES.find((k) => CATEGORIES[k].type === value);
          next.category = firstCat || prev.category;
        }
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const filteredCategories = ALL_CATEGORIES.filter(
    (k) => CATEGORIES[k].type === form.type
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editData ? 'Edit Transaction' : 'Add Transaction'}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} id="txn-form-submit">
            {editData ? 'Save Changes' : 'Add Transaction'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Type toggle */}
        <div className="input-group">
          <label>Type</label>
          <div className="filter-pills">
            <button
              type="button"
              className={`filter-pill ${form.type === 'expense' ? 'active' : ''}`}
              onClick={() => handleChange('type', 'expense')}
              style={form.type === 'expense' ? { background: 'var(--color-expense)', color: '#fff' } : {}}
            >
              ↘ Expense
            </button>
            <button
              type="button"
              className={`filter-pill ${form.type === 'income' ? 'active' : ''}`}
              onClick={() => handleChange('type', 'income')}
              style={form.type === 'income' ? { background: 'var(--color-income)', color: '#fff' } : {}}
            >
              ↗ Income
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="input-group">
          <label>Description</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Grocery shopping"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            id="txn-description"
          />
          {errors.description && (
            <span style={{ color: 'var(--color-expense)', fontSize: 'var(--font-xs)' }}>
              {errors.description}
            </span>
          )}
        </div>

        {/* Amount */}
        <div className="input-group">
          <label>Amount ($)</label>
          <input
            className="form-input"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            id="txn-amount"
          />
          {errors.amount && (
            <span style={{ color: 'var(--color-expense)', fontSize: 'var(--font-xs)' }}>
              {errors.amount}
            </span>
          )}
        </div>

        {/* Category */}
        <div className="input-group">
          <label>Category</label>
          <select
            className="form-select"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            id="txn-category"
          >
            {filteredCategories.map((k) => (
              <option key={k} value={k}>
                {CATEGORIES[k].emoji} {CATEGORIES[k].label}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="input-group">
          <label>Date</label>
          <input
            className="form-input"
            type="date"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
            id="txn-date"
          />
          {errors.date && (
            <span style={{ color: 'var(--color-expense)', fontSize: 'var(--font-xs)' }}>
              {errors.date}
            </span>
          )}
        </div>
      </form>
    </Modal>
  );
}
