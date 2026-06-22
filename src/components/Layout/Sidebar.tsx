import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiCreditCard,
  FiList,
  FiFileText,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

const navItems = [
  { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { path: '/accounts', icon: FiCreditCard, label: 'Accounts' },
  { path: '/transactions', icon: FiList, label: 'Transactions' },
  { path: '/invoices', icon: FiFileText, label: 'Invoices' },
  { path: '/reports', icon: FiBarChart2, label: 'Reports' },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
      </button>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
