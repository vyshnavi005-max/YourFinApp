import { useState, useMemo, useEffect } from 'react';
import { useTransactionContext } from '../../context/TransactionContext';
import { Search, Filter, Plus, Edit2, Trash2, ReceiptText, AlertCircle, Download, FileJson, Settings2, X } from 'lucide-react';
import { exportCSV, exportJSON } from '../../utils/export';
import './Transactions.css';
import { format } from 'date-fns';
import TransactionForm from '../../components/TransactionForm/TransactionForm';
import Loader from '../../components/Loader/Loader';

export default function Transactions() {
  const { transactions, role, deleteTransaction, isLoading, error } = useTransactionContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txToEdit, setTxToEdit] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced filters state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const isAmountRangeInvalid = minAmount && maxAmount && parseFloat(maxAmount) < parseFloat(minAmount);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory('all');
    setSortBy('date');
    setSortOrder('desc');
    setDateFrom('');
    setDateTo('');
    setMinAmount('');
    setMaxAmount('');
  };

  // Debounce search to prevent excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  const handleOpenAdd = () => {
    setTxToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (transaction) => {
    setTxToEdit(transaction);
    setIsModalOpen(true);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(item =>
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    }

    if (filterType !== 'all') {
      result = result.filter(item => item.type === filterType);
    }

    if (filterCategory !== 'all') {
      result = result.filter(item => item.category === filterCategory);
    }

    if (dateFrom) {
      result = result.filter(item => new Date(item.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      result = result.filter(item => new Date(item.date) <= new Date(dateTo));
    }

    if (!isAmountRangeInvalid) {
      if (minAmount) {
        result = result.filter(item => Math.abs(item.amount) >= parseFloat(minAmount));
      }

      if (maxAmount) {
        result = result.filter(item => Math.abs(item.amount) <= parseFloat(maxAmount));
      }
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        comparison = dateA - dateB;
      } else {
        const amountA = Math.abs(parseFloat(a.amount));
        const amountB = Math.abs(parseFloat(b.amount));
        comparison = amountA - amountB;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [transactions, debouncedSearch, filterType, filterCategory, sortBy, sortOrder, dateFrom, dateTo, minAmount, maxAmount]);

  const handleExportCSV = () => {
    exportCSV(filteredAndSorted, 'transactions_export.csv');
  };

  const handleExportJSON = () => {
    exportJSON(filteredAndSorted, 'transactions_export.json');
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Manage and view your Transactions.</p>
        </div>

        <div className="header-actions-group">
          <div className="export-actions">
            <button
              className="btn btn-secondary save-btn"
              onClick={() => setShowExportOptions(!showExportOptions)}
              title="Save Transactions"
            >
              <Download size={18} />
              <span>Save</span>
            </button>

            {showExportOptions && (
              <div className="export-dropdown glass-card">
                <button onClick={() => { handleExportCSV(); setShowExportOptions(false); }}>
                  <Download size={16} /> CSV
                </button>
                <button onClick={() => { handleExportJSON(); setShowExportOptions(false); }}>
                  <FileJson size={16} /> JSON
                </button>
              </div>
            )}
          </div>

          {role === 'admin' && (
            <button className="btn btn-primary" onClick={handleOpenAdd}>
              <Plus size={18} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="controls-bar card glass-card">
        <div className="search-bar-row">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bar-actions">
            <button
              className={`btn btn-secondary filter-toggle ${showAdvanced ? 'active' : ''}`}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings2 size={18} />
              <span>Filter</span>
            </button>
            <button className="btn btn-ghost" onClick={clearFilters} title="Clear all filters">
              <X size={18} />
            </button>
          </div>
        </div>

        {showAdvanced && (
          <div className="advanced-filters-section">
            <div className="filter-grid">
              <div className="filter-group">
                <label>Type</label>
                <select value={filterType} onChange={(e) => {
                  setFilterType(e.target.value);
                  setFilterCategory('all');
                }}>
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Date From</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>

              <div className="filter-group">
                <label>Date To</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>

              <div className="filter-group">
                <label>Min Amount</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className={isAmountRangeInvalid ? 'invalid' : ''}
                />
              </div>

              <div className="filter-group">
                <label>Max Amount</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className={isAmountRangeInvalid ? 'invalid' : ''}
                />
              </div>

              <div className="filter-group">
                <label>Sort By</label>
                <div className="sort-controls-group">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                  </select>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    {sortBy === 'date' ? (
                      <>
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                      </>
                    ) : (
                      <>
                        <option value="desc">Highest First</option>
                        <option value="asc">Lowest First</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
            {isAmountRangeInvalid && (
              <p className="filter-error-msg">
                <AlertCircle size={14} />
                Max amount must be greater than min amount
              </p>
            )}
          </div>
        )}
      </div>

      <div className="transactions-list card glass-card">
        {isLoading ? (
          <div className="loading-state">
            <Loader />
          </div>
        ) : error ? (
          <div className="empty-state">
            <AlertCircle size={48} className="empty-icon" style={{ color: 'var(--danger-color)' }} />
            <h3>Data Fetch Failed</h3>
            <p>{error}</p>
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="empty-state">
            <ReceiptText size={48} className="empty-icon" />
            <h3>No transactions found</h3>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  {role === 'admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map(transaction => (
                  <tr key={transaction.id}>
                    <td>{format(new Date(transaction.date), 'MMM dd, yyyy')}</td>
                    <td className="tx-desc">{transaction.description}</td>
                    <td>
                      <span className={`badge type-badge ${transaction.type}`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="badge category-badge">{transaction.category}</span>
                    </td>
                    <td className={`tx-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{parseFloat(transaction.amount).toLocaleString()}/-
                    </td>
                    {role === 'admin' && (
                      <td className="tx-actions">
                        <button className="icon-btn edit" onClick={() => handleOpenEdit(transaction)}><Edit2 size={16} /></button>
                        <button className="icon-btn delete" onClick={() => deleteTransaction(transaction.id)}><Trash2 size={16} /></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTxToEdit(null);
        }}
        transactionToEdit={txToEdit}
      />
    </div>
  );
}
