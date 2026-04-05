import React, { useMemo } from 'react';
import { useTransactionContext } from '../../context/TransactionContext';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import './Dashboard.css';
import Loader from '../../components/Loader/Loader';
import { subDays, isAfter, startOfDay } from 'date-fns';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

const Dashboard = () => {
  const { transactions, isLoading } = useTransactionContext();

  if (isLoading) {
    return <Loader />;
  }

  // Basic summary stats calculated from transaction list
  const { income, expense, balance } = useMemo(() => {
    let inc = 0, exp = 0;

    // Tally up totals
    transactions.forEach(tx => {
      if (tx.type === 'income') inc += parseFloat(tx.amount);
      if (tx.type === 'expense') exp += parseFloat(tx.amount);
    });

    return { income: inc, expense: exp, balance: inc - exp };
  }, [transactions]);

  // Group expenses by category for the pie chart
  const expenseByCategory = useMemo(() => {
    const expenses = transactions.filter(tx => tx.type === 'expense');
    const categoryMap = {};
    expenses.forEach(tx => {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + parseFloat(tx.amount);
    });
    return Object.keys(categoryMap).map(key => ({
      name: key,
      value: categoryMap[key]
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Calculate a running balance trend for the line chart
  const trendData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.reduce((acc, tx) => {
      const prevBalance = acc.length ? acc[acc.length - 1].balance : 0;
      const newBalance = tx.type === 'income'
        ? prevBalance + parseFloat(tx.amount)
        : prevBalance - parseFloat(tx.amount);
      acc.push({
        date: format(new Date(tx.date), 'MMM dd'),
        balance: newBalance
      });
      return acc;
    }, []);
  }, [transactions]);

  // Calculate last 7 days of spending for the new bar chart
  const last7DaysData = useMemo(() => {
    const today = startOfDay(new Date());
    const sevenDaysAgo = subDays(today, 6);
    
    // Create an array of the last 7 days
    const daysArr = [];
    for (let i = 0; i < 7; i++) {
      const date = subDays(today, 6 - i);
      daysArr.push({
        dateStr: format(date, 'EEE'), // Mon, Tue, etc.
        fullDate: format(date, 'yyyy-MM-dd'),
        amount: 0
      });
    }

    // Fill in the amounts from transactions
    transactions.filter(tx => tx.type === 'expense').forEach(tx => {
      const txDate = startOfDay(new Date(tx.date));
      if (isAfter(txDate, subDays(sevenDaysAgo, 1))) {
        const dateKey = format(txDate, 'yyyy-MM-dd');
        const dayObj = daysArr.find(d => d.fullDate === dateKey);
        if (dayObj) {
          dayObj.amount += parseFloat(tx.amount);
        }
      }
    });

    return daysArr;
  }, [transactions]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      <div className="summary-cards">
        <div className="card summary-card glass-card">
          <div className="card-top">
            <div className="icon-wrapper primary" ><IndianRupee size={24} /></div>
          </div>
          <div className="card-info">
            <span className="card-label">Total Balance</span>
            <h2 className="card-value">₹{balance.toLocaleString()}/-</h2>
          </div>
        </div>
        <div className="card summary-card glass-card">
          <div className="card-top">
            <div className="icon-wrapper success"><TrendingUp size={24} /></div>
          </div>
          <div className="card-info">
            <span className="card-label">Total Income</span>
            <h2 className="card-value">₹{income.toLocaleString()}/-</h2>
          </div>
        </div>
        <div className="card summary-card glass-card">
          <div className="card-top">
            <div className="icon-wrapper danger"><TrendingDown size={24} /></div>
          </div>
          <div className="card-info">
            <span className="card-label">Total Expenses</span>
            <h2 className="card-value">₹{expense.toLocaleString()}/-</h2>
          </div>
        </div>
      </div>

      <div className="charts-grid-row">
        <div className="card chart-card glass-card">
          <h3>Balance Trend</h3>
          {transactions.length === 0 ? (<h3 className="empty-chart-msg">No transactions yet</h3>) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                  <Line type="monotone" dataKey="balance" stroke="var(--primary-color)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card chart-card glass-card">
          <h3>Expense Breakdown</h3>
          {transactions.length === 0 ? (<h3 className="empty-chart-msg">No transactions yet</h3>) : (
            <div className="chart-container-compact">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="custom-legend-compact">
                {expenseByCategory.slice(0, 5).map((entry, index) => (
                  <div key={entry.name} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="legend-label">{entry.name}</span>
                    <span className="legend-value">₹{Math.round(entry.value).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card chart-card glass-card">
          <h3>Weekly Spending</h3>
          {transactions.length === 0 ? (<h3 className="empty-chart-msg">No transactions yet</h3>) : (
            <div className="chart-container-compact">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={last7DaysData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="dateStr" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'var(--border-color)', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }}
                    formatter={(v) => `₹${v}`}
                  />
                  <Bar dataKey="amount" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
