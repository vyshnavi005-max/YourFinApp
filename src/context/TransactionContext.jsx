import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/mockApi';

const TransactionContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTransactionContext = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finapp_v2_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(transactions.length === 0);
  const [error, setError] = useState(null);
  
  const [role, setRole] = useState(() => {
    return localStorage.getItem('finapp_v2_role') || 'viewer';
  }); 
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finapp_v2_theme') || 'light';
  }); 

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('finapp_v2_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finapp_v2_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('finapp_v2_theme', theme);
  }, [theme]);

  // Load initial static data or previous session data
  useEffect(() => {
    async function loadData() {
      if (transactions.length > 0) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await api.fetchTransactions();
        setTransactions(data);
        setError(null);
      } catch (err) {
        console.error("error loading data:", err);
        setError('Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // sync theme with document body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addTransaction = async(newTransaction) => {
    setIsLoading(true);
    try {
      const added = await api.addTransaction(newTransaction);
      setTransactions(prev => [added, ...prev]);
    }catch(err)
    {
      console.log(err);
      setError('Failed to add transaction');
    }
    finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    setIsLoading(true);
    try {
      await api.deleteTransaction(id);
      setTransactions(current => current.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (id, updatedData) => {
    setIsLoading(true);
    try {
      const saved = await api.updateTransaction(id, updatedData);
      setTransactions(current => current.map(item => item.id === id ? saved : item));
    } catch (err) {
      console.error(err);
      setError('Failed to update transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      isLoading,
      error,
      role,
      setRole,
      theme,
      toggleTheme,
      addTransaction,
      deleteTransaction,
      updateTransaction
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
