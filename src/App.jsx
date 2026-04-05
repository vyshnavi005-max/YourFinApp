import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import Dashboard from './pages/Dashboard/Dashboard';
import Transactions from './pages/Transactions/Transactions';
import Insights from './pages/Insights/Insights';
import NotFound from './pages/NotFound/NotFound';
import './App.css';
import Header from './components/Header/Header';


export default function App() {
  return (
    <BrowserRouter>
      <TransactionProvider>
        <div className="app-container">
          <Header />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </TransactionProvider>
    </BrowserRouter>
  );
}
