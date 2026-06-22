import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiDollarSign, FiLogOut } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          <FiDollarSign size={24} />
          <span>SoleFin</span>
        </Link>
      </div>
      {isAuthenticated && (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/accounts">Accounts</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/invoices">Invoices</Link>
          <Link to="/reports">Reports</Link>
        </div>
      )}
      <div className="navbar-right">
        {isAuthenticated && user && (
          <>
            <span className="navbar-user">{user.name}</span>
            <button className="btn btn-outline" onClick={logout}>
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
