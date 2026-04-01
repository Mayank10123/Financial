import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { defaultTransactions } from '../data/mockData';
import { mockApi } from '../data/mockApi';

const AppContext = createContext(null);

// LocalStorage helpers
const loadState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    // Rehydrate dates for transactions
    if (key === 'finsight_transactions' && Array.isArray(parsed)) {
      return parsed.map((t) => ({ ...t, date: new Date(t.date) }));
    }
    return parsed;
  } catch {
    return fallback;
  }
};

const saveState = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
};

// Initial state
const getInitialState = () => ({
  transactions: loadState('finsight_transactions', defaultTransactions),
  filters: {
    search: '',
    category: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc',
  },
  role: loadState('finsight_role', 'admin'),
  theme: loadState('finsight_theme', 'dark'),
  currentPage: 'dashboard',
  isLoading: false,
  sidebarOpen: false,
  notification: null,
});

// Action types
const ACTIONS = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_FILTER: 'SET_FILTER',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_ROLE: 'SET_ROLE',
  SET_THEME: 'SET_THEME',
  SET_PAGE: 'SET_PAGE',
  SET_LOADING: 'SET_LOADING',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };

    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case ACTIONS.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case ACTIONS.SET_FILTER:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: {
          search: '',
          category: 'all',
          type: 'all',
          dateFrom: '',
          dateTo: '',
          sortBy: 'date',
          sortOrder: 'desc',
        },
      };

    case ACTIONS.SET_ROLE:
      return { ...state, role: action.payload };

    case ACTIONS.SET_THEME:
      return { ...state, theme: action.payload };

    case ACTIONS.SET_PAGE:
      return { ...state, currentPage: action.payload, sidebarOpen: false };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case ACTIONS.SET_NOTIFICATION:
      return { ...state, notification: action.payload };

    case ACTIONS.CLEAR_NOTIFICATION:
      return { ...state, notification: null };

    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, getInitialState);

  // Persist transactions
  useEffect(() => {
    saveState('finsight_transactions', state.transactions);
  }, [state.transactions]);

  // Persist role
  useEffect(() => {
    saveState('finsight_role', state.role);
  }, [state.role]);

  // Persist & apply theme
  useEffect(() => {
    saveState('finsight_theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Auto-clear notifications
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        dispatch({ type: ACTIONS.CLEAR_NOTIFICATION });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.notification]);

  // Action creators
  const notify = useCallback((message, type = 'success') => {
    dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: { message, type } });
  }, []);

  const addTransaction = useCallback(async (txnData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await mockApi.addTransaction(txnData);
      if (res.success) {
        dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: res.data });
        notify('Transaction added successfully');
      }
    } catch (err) {
      notify('Failed to add transaction', 'error');
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [notify]);

  const updateTransaction = useCallback(async (txnData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await mockApi.updateTransaction(txnData);
      if (res.success) {
        dispatch({ type: ACTIONS.UPDATE_TRANSACTION, payload: res.data });
        notify('Transaction updated successfully');
      }
    } catch (err) {
      notify('Failed to update transaction', 'error');
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [notify]);

  const deleteTransaction = useCallback(async (id) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await mockApi.deleteTransaction(id);
      if (res.success) {
        dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id });
        notify('Transaction deleted');
      }
    } catch (err) {
      notify('Failed to delete transaction', 'error');
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [notify]);

  const setFilter = useCallback((filter) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: filter });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_FILTERS });
  }, []);

  const setRole = useCallback((role) => {
    dispatch({ type: ACTIONS.SET_ROLE, payload: role });
    notify(`Switched to ${role} role`);
  }, [notify]);

  const toggleTheme = useCallback(() => {
    dispatch({
      type: ACTIONS.SET_THEME,
      payload: state.theme === 'dark' ? 'light' : 'dark',
    });
  }, [state.theme]);

  const setPage = useCallback((page) => {
    dispatch({ type: ACTIONS.SET_PAGE, payload: page });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_SIDEBAR });
  }, []);

  // Computed values: filter & sort transactions
  const getFilteredTransactions = useCallback(() => {
    let result = [...state.transactions];

    // Search filter
    if (state.filters.search) {
      const q = state.filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (state.filters.category !== 'all') {
      result = result.filter((t) => t.category === state.filters.category);
    }

    // Type filter
    if (state.filters.type !== 'all') {
      result = result.filter((t) => t.type === state.filters.type);
    }

    // Date range
    if (state.filters.dateFrom) {
      const from = new Date(state.filters.dateFrom);
      result = result.filter((t) => new Date(t.date) >= from);
    }
    if (state.filters.dateTo) {
      const to = new Date(state.filters.dateTo);
      to.setHours(23, 59, 59);
      result = result.filter((t) => new Date(t.date) <= to);
    }

    // Sort
    const { sortBy, sortOrder } = state.filters;
    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') {
        cmp = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'amount') {
        cmp = a.amount - b.amount;
      } else if (sortBy === 'description') {
        cmp = a.description.localeCompare(b.description);
      } else if (sortBy === 'category') {
        cmp = a.category.localeCompare(b.category);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [state.transactions, state.filters]);

  const value = {
    ...state,
    dispatch,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilter,
    resetFilters,
    setRole,
    toggleTheme,
    setPage,
    toggleSidebar,
    getFilteredTransactions,
    notify,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
