import { useState } from 'react';
import { useTransactionContext } from '../../context/TransactionContext';
import { Moon, Sun, User, Shield, Menu, X, IndianRupee } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { role, setRole, theme, toggleTheme } = useTransactionContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  function getNavBtnClass(isActive) {
    if (isActive) {
      return 'header-nav-btn active';
    } else {
      return 'header-nav-btn';
    }
  }

  return (
    <header className="header">
      <Link to="/" className='app-name'>
        <div className="logo-icon"><IndianRupee size={24} /></div>
        <h1>Your FinApp</h1>
      </Link>


      <div className={`nav-actions-container ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="header-nav">
          <ul>
            <li key="dashboard">
              <NavLink
                to="/"
                className={({ isActive }) => getNavBtnClass(isActive)}
                onClick={() => setIsMobileMenuOpen(false)}
                end={true}
              >
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li key="transactions">
              <NavLink
                to="/transactions"
                className={({ isActive }) => getNavBtnClass(isActive)}
                onClick={() => setIsMobileMenuOpen(false)}
                end={false}
              >
                <span>Transactions</span>
              </NavLink>
            </li>

            <li key="insights">
              <NavLink
                to="/insights"
                className={({ isActive }) => getNavBtnClass(isActive)}
                onClick={() => setIsMobileMenuOpen(false)}
                end={false}
              >
                <span>Insights</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className="header-actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>


        <div className="role-switcher">
          {role === 'admin' ? <Shield size={18} className="role-icon admin" /> : <User size={18} className="role-icon viewer" />}
          <select value={role} onChange={handleRoleChange} className="role-select">
            <option defaultValue value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="user-profile">
          <div className="avatar">V</div>{/*My name hehe*/}
        </div>

        <button className="mobile-menu-btn icon-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
