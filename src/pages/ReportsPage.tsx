import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { FiPieChart, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

type ReportType = 'pnl' | 'expense_category' | 'income_source';

const expenseByCategoryData = [
  { name: 'Rent', amount: 7200, color: '#E74C3C' },
  { name: 'Software', amount: 1800, color: '#3498DB' },
  { name: 'Marketing', amount: 2100, color: '#F39C12' },
  { name: 'Supplies', amount: 510, color: '#27AE60' },
  { name: 'Utilities', amount: 1320, color: '#9B59B6' },
  { name: 'Insurance', amount: 2400, color: '#1ABC9C' },
  { name: 'Travel', amount: 950, color: '#E67E22' },
];

const pnlData = [
  { label: 'Services Revenue', amount: 42000 },
  { label: 'Product Sales', amount: 15000 },
  { label: 'Total Revenue', amount: 57000, isBold: true },
  { label: '', amount: null, isSpacer: true },
  { label: 'Rent', amount: -7200 },
  { label: 'Software & Tools', amount: -1800 },
  { label: 'Marketing', amount: -2100 },
  { label: 'Office Supplies', amount: -510 },
  { label: 'Utilities', amount: -1320 },
  { label: 'Insurance', amount: -2400 },
  { label: 'Travel', amount: -950 },
  { label: 'Miscellaneous', amount: -1420 },
  { label: 'Total Expenses', amount: -17700, isBold: true },
  { label: '', amount: null, isSpacer: true },
  { label: 'Net Profit', amount: 39300, isBold: true, isHighlight: true },
];

const ReportsPage: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportType>('pnl');
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-04-12');

  return (
    <div className="reports-page">
      <h1 className="page-title">Reports</h1>

      <div className="report-selectors">
        <button
          className={`report-selector-card ${activeReport === 'pnl' ? 'active' : ''}`}
          onClick={() => setActiveReport('pnl')}
        >
          <FiDollarSign size={24} />
          <span>Profit & Loss</span>
        </button>
        <button
          className={`report-selector-card ${activeReport === 'expense_category' ? 'active' : ''}`}
          onClick={() => setActiveReport('expense_category')}
        >
          <FiPieChart size={24} />
          <span>Expense by Category</span>
        </button>
        <button
          className={`report-selector-card ${activeReport === 'income_source' ? 'active' : ''}`}
          onClick={() => setActiveReport('income_source')}
        >
          <FiTrendingUp size={24} />
          <span>Income by Source</span>
        </button>
      </div>

      <div className="card filter-bar">
        <label>From:</label>
        <input
          type="date"
          className="form-control filter-date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <label>To:</label>
        <input
          type="date"
          className="form-control filter-date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      {activeReport === 'expense_category' && (
        <div className="card chart-card">
          <h2 className="card-title">Expense by Category</h2>
          <p className="card-subtitle">{dateFrom} to {dateTo}</p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={expenseByCategoryData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {expenseByCategoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === 'pnl' && (
        <div className="card">
          <h2 className="card-title">Profit & Loss Statement</h2>
          <p className="card-subtitle">{dateFrom} to {dateTo}</p>
          <table className="table pnl-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {pnlData.map((row, i) => {
                if (row.isSpacer) {
                  return (
                    <tr key={i}>
                      <td colSpan={2} style={{ height: '0.5rem', border: 'none' }}></td>
                    </tr>
                  );
                }
                return (
                  <tr
                    key={i}
                    className={`${row.isBold ? 'pnl-bold' : ''} ${row.isHighlight ? 'pnl-highlight' : ''}`}
                  >
                    <td>{row.label}</td>
                    <td style={{ textAlign: 'right' }}>
                      {row.amount !== null && (
                        <span className={row.amount >= 0 ? 'amount-income' : 'amount-expense'}>
                          {row.amount >= 0 ? '' : '-'}${Math.abs(row.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === 'income_source' && (
        <div className="card chart-card">
          <h2 className="card-title">Income by Source</h2>
          <p className="card-subtitle">{dateFrom} to {dateTo}</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Services', amount: 42000 },
                { name: 'Product Sales', amount: 15000 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Bar dataKey="amount" fill="var(--success)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
