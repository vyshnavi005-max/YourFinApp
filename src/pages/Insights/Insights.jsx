import { useMemo } from 'react';
import { useTransactionContext } from '../../context/TransactionContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { ReceiptText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Insights.css';
import Loader from '../../components/Loader/Loader';

const Insights = () => {
  const { transactions, isLoading, error, role } = useTransactionContext();

  const expenses = transactions.filter(t => t.type === 'expense');

  const insightsData = useMemo(() => {
    if (transactions.length === 0) return null;

    const categoryTotals = {};
    let totalExpense = 0;

    expenses.forEach(tx => {
      const amt = parseFloat(tx.amount);
      totalExpense += amt;
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amt;
    });

    let highestCategory = 'N/A';
    let highestCategoryAmount = 0;

    if (Object.keys(categoryTotals).length > 0) {
      for (const [cat, amt] of Object.entries(categoryTotals)) {
        if (amt > highestCategoryAmount) {
          highestCategoryAmount = amt;
          highestCategory = cat;
        }
      }
    }

    const categoryPercentage = totalExpense > 0
      ? Math.round((highestCategoryAmount / totalExpense) * 100)
      : 0;

    const categoryDataForChart = Object.keys(categoryTotals).map(cat => ({
      category: cat,
      amount: categoryTotals[cat]
    })).sort((a, b) => b.amount - a.amount);

    const monthlyDataMap = {};
    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const monthYear = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear().toString().slice(-2);

      if (!monthlyDataMap[monthYear]) {
        monthlyDataMap[monthYear] = { month: monthYear, income: 0, expense: 0, timestamp: date.getTime() };
      }

      if (tx.type === 'income') {
        monthlyDataMap[monthYear].income += parseFloat(tx.amount || 0);
      } else if (tx.type === 'expense') {
        monthlyDataMap[monthYear].expense += parseFloat(tx.amount || 0);
      }
    });

    const monthlyIncomeExpenseData = Object.values(monthlyDataMap).sort((a, b) => a.timestamp - b.timestamp);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let currentMonthTotal = 0;
    let prevMonthTotal = 0;

    expenses.forEach(tx => {
      const date = new Date(tx.date);
      const m = date.getMonth();
      const y = date.getFullYear();

      if (y === currentYear && m === currentMonth) {
        currentMonthTotal += parseFloat(tx.amount);
      } else if ((y === currentYear && m === currentMonth - 1) ||
        (m === 11 && currentMonth === 0 && y === currentYear - 1)) {
        prevMonthTotal += parseFloat(tx.amount);
      }
    });

    let monthlyChangeStr = "No data for previous month to compare.";
    let changeType = 'none';

    if (expenses.length === 0) {
      monthlyChangeStr = "No expenses recorded yet.";
    } else if (prevMonthTotal > 0) {
      const diff = currentMonthTotal - prevMonthTotal;
      const percentage = Math.round(Math.abs(diff) / prevMonthTotal * 100);
      if (diff > 0) {
        changeType = 'increase';
        monthlyChangeStr = `Spending increased by ${percentage}% compared to last month`;
      } else if (diff < 0) {
        changeType = 'decrease';
        monthlyChangeStr = `Spending decreased by ${percentage}% compared to last month`;
      } else {
        monthlyChangeStr = 'Spending is the same as last month';
      }
    }

    let highestSingleExpense = expenses.length > 0 ? expenses[0] : null;
    if (highestSingleExpense) {
      expenses.forEach(tx => {
        if (parseFloat(tx.amount) > parseFloat(highestSingleExpense.amount)) {
          highestSingleExpense = tx;
        }
      });
    }

    return {
      highestCategory,
      highestCategoryAmount,
      categoryPercentage,
      monthlyChangeStr,
      changeType,
      highestSingleExpense,
      categoryDataForChart,
      monthlyIncomeExpenseData
    };
  }, [transactions, expenses]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="empty-state glass-card">
        <AlertCircle size={48} className="empty-icon" style={{ color: 'var(--danger-color)' }} />
        <h3>Data Fetch Failed</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!insightsData) {
    return (
      <div className="insights-page">
        <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
          <h1>Detailed Insights</h1>
        </div>
        <div className="empty-state glass-card">
          <ReceiptText size={48} className="empty-icon" />
          <h3>No transactions found</h3>
          <p>
            {role === 'admin' 
              ? "Start by adding your first transaction to see your analytics." 
              : "Switch to the Admin role to start adding transactions."
            }
          </p>
          {role === 'admin' ? (
            <Link to="/transactions?action=add" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Add Transaction
            </Link>
          ) : (
            <div className="role-hint">
              <p>Use the role switcher in the header to become an <strong>Admin</strong>.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const {
    highestCategory,
    highestCategoryAmount,
    categoryPercentage,
    monthlyChangeStr,
    changeType,
    highestSingleExpense,
    categoryDataForChart,
    monthlyIncomeExpenseData
  } = insightsData;


  return (
    <div className="insights-page">
      <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
        <h1>Detailed Insights</h1>
      </div>

      <div className="insights-container">
        <h3>Smart Observations</h3>
        <div className="insights-grid">
          <div className="insight-card glass-card">
            <h4>Top Spending</h4>
            {highestCategoryAmount > 0 ? (
              <p>
                You spent the most on <strong>{highestCategory}</strong> (₹{highestCategoryAmount.toLocaleString()}),
                which is <strong>{categoryPercentage}%</strong> of your total expenses.
              </p>
            ) : (
              <p>No expenses recorded yet. Your spending breakdown will appear here.</p>
            )}
          </div>

          <div className="insight-card glass-card">
            <h4>Monthly Trend</h4>
            <p>
              {changeType === 'increase' && <span className="indicator increase">🔺</span>}
              {changeType === 'decrease' && <span className="indicator decrease">🔻</span>}
              {monthlyChangeStr}
            </p>
          </div>

          <div className="insight-card glass-card">
            <h4>Largest Expense</h4>
            {highestSingleExpense ? (
              <p>
                Your highest single expense was <strong>₹{parseFloat(highestSingleExpense.amount).toLocaleString()}</strong> on {highestSingleExpense.category}.
              </p>
            ) : (
              <p>No expenses recorded yet. Your largest purchases will be highlighted here.</p>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div className="insight-card glass-card">
            <h4>Monthly Income vs Expenses</h4>
            <div className="chart-container-compact" style={{ marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height={260} minWidth={0} debounce={50}>
                <BarChart data={monthlyIncomeExpenseData} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'var(--border-color)', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="insight-card glass-card">
            <h4>Category Breakdown</h4>
            <div className="chart-container-compact" style={{ marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height={260} minWidth={0} debounce={50}>
                <BarChart data={categoryDataForChart} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="category" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'var(--border-color)', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Expenses']}
                  />
                  <Bar dataKey="amount" fill="var(--primary-color)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
