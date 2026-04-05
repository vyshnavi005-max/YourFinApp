import { useState, useEffect } from 'react';
import { useTransactionContext } from '../../context/TransactionContext';
import { CATEGORIES } from '../../data/mockData';
import { X } from 'lucide-react';
import './TransactionForm.css';

function TransactionForm({ isOpen, onClose, transactionToEdit = null }) {
  const { addTransaction, updateTransaction, isLoading } = useTransactionContext();

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: CATEGORIES.expense[0],
    date: new Date().toISOString().split('T')[0]
  });



  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setAmountError('');
      return;
    }
    if (transactionToEdit) {
      setFormData({
        description: transactionToEdit.description,
        amount: transactionToEdit.amount,
        type: transactionToEdit.type,
        category: transactionToEdit.category,
        date: transactionToEdit.date
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: CATEGORIES.expense[0],
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;

    // Update category when type changes
    setFormData(current => ({
      ...current,
      type: selectedType,
      category: CATEGORIES[selectedType][0]
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setAmountError('');

    const parsedAmount = parseFloat(formData.amount);
    
    // Explicit validation for amount > 0
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Amount must be greater than zero');
      return;
    }

    const payload = { ...formData, amount: parsedAmount };
  
    if (transactionToEdit) {
      await updateTransaction(transactionToEdit.id, payload);
    } else {
      await addTransaction(payload);
    }
  
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card slide-up">
        <div className="modal-header">
          <h2>{transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleFormSubmit} className="modal-form">
          <div className="form-group">
            <label>Type</label>
            <div className="type-toggle">
              <label className={formData.type === 'expense' ? 'active radio-label expense' : 'radio-label'}>
                <input type="radio" value="expense" checked={formData.type === 'expense'} onChange={handleTypeChange} />
                Expense
              </label>
              <label className={formData.type === 'income' ? 'active radio-label income' : 'radio-label'}>
                <input type="radio" value="income" checked={formData.type === 'income'} onChange={handleTypeChange} />
                Income
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="e.g. Grocery Shopping"
            />
          </div>

          <div className="form-group row">
            <div className="col">
              <label>Amount</label>
              <div className={`amount-input ${amountError ? 'invalid' : ''}`}>
                <span className="currency">₹</span>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={formData.amount}
                  onChange={e => {
                    setFormData(p => ({ ...p, amount: e.target.value }));
                    if (amountError) setAmountError('');
                  }}
                  placeholder="0.00"
                />
              </div>
              {amountError && <span className="error-text">{amountError}</span>}
            </div>
            <div className="col">
              <label>Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
            >
              {CATEGORIES[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;
