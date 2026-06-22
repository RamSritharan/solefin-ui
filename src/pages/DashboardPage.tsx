import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiActivity } from 'react-icons/fi';
import { Transaction } from '../types';

const monthlyData = [
  { month: 'Nov', income: 8200, expenses: 4100 },
  { month: 'Dec', income: 9500, expenses: 5200 },
  { month: 'Jan', income: 7800, expenses: 3900 },
  { month: 'Feb', income: 10200, expenses: 4800 },
  { month: 'Mar', income: 11500, expenses: 5500 },
  { month: 'Apr', income: 9800, expenses: 4200 },
];

const recentTransactions: Transaction[] = [
  {
    id: '1',
    accountId: 'a1',
    categoryId: 'c1',
    amount: 2500,
    type: 'income',
    date: '2026-04-10',
    description: 'Client payment - Web Design',
    category: { id: 'c1', name: 'Services', type: 'income', isCustom: false },
  },
  {
    id: '2',
    accountId: 'a1',
    categoryId: 'c2',
    amount: 150,
    type: 'expense',
    date: '2026-04-09',
    description: 'Adobe Creative Cloud',
    category: { id: 'c2', name: 'Software', type: 'expense', isCustom: false },
  },
  {
    id: '3',
    accountId: 'a1',
    categoryId: 'c3',
    amount: 85,
    type: 'expense',
    date: '2026-04-08',
    description: 'Office Supplies',
    category: { id: 'c3', name: 'Supplies', type: 'expense', isCustom: false },
  },
  {
    id: '4',
    accountId: 'a1',
    categoryId: 'c1',
    amount: 4200,
    type: 'income',
    date: '2026-04-07',
    description: 'Client payment - Consulting',
    category: { id: 'c1', name: 'Services', type: 'income', isCustom: false },
  },
  {
    id: '5',
    accountId: 'a1',
    categoryId: 'c4',
    amount: 1200,
    type: 'expense',
    date: '2026-04-05',
    description: 'Rent - Office Space',
    category: { id: 'c4', name: 'Rent', type: 'expense', isCustom: false },
  },
];

const summaryCards = [
  {
    label: 'Total Income',
    value: '$57,000',
    icon: FiTrendingUp,
    color: 'var(--success)',
    bg: '#e8f8ef',
  },
  {
    label: 'Total Expenses',
    value: '$27,700',
    icon: FiTrendingDown,
    color: 'var(--danger)',
    bg: '#fde8e8',
  },
  {
    label: 'Net Profit',
    value: '$29,300',
    icon: FiDollarSign,
    color: 'var(--primary)',
    bg: '#e0edf6',
  },
  {
    label: 'Cash Flow',
    value: '$5,600',
    icon: FiActivity,
    color: 'var(--warning)',
    bg: '#fef5e0',
  },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      <div className="summary-grid">
        {summaryCards.map((card) => (
          <div key={card.label} className="summary-card" style={{ borderLeftColor: card.color }}>
            <div className="summary-card-icon" style={{ backgroundColor: card.bg, color: card.color }}>
              <card.icon size={24} />
            </div>
            <div className="summary-card-info">
              <span className="summary-card-label">{card.label}</span>
              <span className="summary-card-value">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card chart-card">
          <h2 className="card-title">Income vs Expenses (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="var(--success)" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="var(--danger)" strokeWidth={2} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="card-title">Recent Transactions</h2>
          <div className="transactions-list">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-desc">{tx.description}</span>
                  <span className="transaction-meta">
                    {tx.category?.name} &middot; {tx.date}
                  </span>
                </div>
                <span className={`transaction-amount ${tx.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
