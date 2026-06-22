import React, { useState, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiPlus, FiFilter, FiX } from 'react-icons/fi';
import { Transaction } from '../types';

const transactionSchema = Yup.object().shape({
  description: Yup.string().required('Description is required'),
  amount: Yup.number().positive('Amount must be positive').required('Amount is required'),
  type: Yup.string().oneOf(['income', 'expense']).required('Type is required'),
  date: Yup.string().required('Date is required'),
  categoryId: Yup.string().required('Category is required'),
  notes: Yup.string(),
});

const categories = [
  { id: 'c1', name: 'Services', type: 'income' as const },
  { id: 'c2', name: 'Product Sales', type: 'income' as const },
  { id: 'c3', name: 'Software', type: 'expense' as const },
  { id: 'c4', name: 'Rent', type: 'expense' as const },
  { id: 'c5', name: 'Supplies', type: 'expense' as const },
  { id: 'c6', name: 'Marketing', type: 'expense' as const },
  { id: 'c7', name: 'Utilities', type: 'expense' as const },
];

const initialTransactions: Transaction[] = [
  { id: '1', accountId: 'a1', categoryId: 'c1', amount: 2500, type: 'income', date: '2026-04-10', description: 'Client payment - Web Design', category: { id: 'c1', name: 'Services', type: 'income', isCustom: false } },
  { id: '2', accountId: 'a1', categoryId: 'c3', amount: 150, type: 'expense', date: '2026-04-09', description: 'Adobe Creative Cloud', category: { id: 'c3', name: 'Software', type: 'expense', isCustom: false } },
  { id: '3', accountId: 'a1', categoryId: 'c5', amount: 85, type: 'expense', date: '2026-04-08', description: 'Office Supplies', category: { id: 'c5', name: 'Supplies', type: 'expense', isCustom: false } },
  { id: '4', accountId: 'a1', categoryId: 'c1', amount: 4200, type: 'income', date: '2026-04-07', description: 'Client payment - Consulting', category: { id: 'c1', name: 'Services', type: 'income', isCustom: false } },
  { id: '5', accountId: 'a1', categoryId: 'c4', amount: 1200, type: 'expense', date: '2026-04-05', description: 'Rent - Office Space', category: { id: 'c4', name: 'Rent', type: 'expense', isCustom: false } },
  { id: '6', accountId: 'a1', categoryId: 'c6', amount: 350, type: 'expense', date: '2026-04-04', description: 'Google Ads Campaign', category: { id: 'c6', name: 'Marketing', type: 'expense', isCustom: false } },
  { id: '7', accountId: 'a1', categoryId: 'c2', amount: 780, type: 'income', date: '2026-04-03', description: 'Product sale - Template Pack', category: { id: 'c2', name: 'Product Sales', type: 'income', isCustom: false } },
  { id: '8', accountId: 'a1', categoryId: 'c7', amount: 220, type: 'expense', date: '2026-04-02', description: 'Internet & Phone', category: { id: 'c7', name: 'Utilities', type: 'expense', isCustom: false } },
];

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (filterType !== 'all' && tx.type !== filterType) return false;
      if (filterCategory !== 'all' && tx.categoryId !== filterCategory) return false;
      if (filterDateFrom && tx.date < filterDateFrom) return false;
      if (filterDateTo && tx.date > filterDateTo) return false;
      return true;
    });
  }, [transactions, filterType, filterCategory, filterDateFrom, filterDateTo]);

  const handleAdd = (values: any) => {
    const cat = categories.find((c) => c.id === values.categoryId);
    const newTx: Transaction = {
      id: Date.now().toString(),
      accountId: 'a1',
      categoryId: values.categoryId,
      amount: Number(values.amount),
      type: values.type,
      date: values.date,
      description: values.description,
      notes: values.notes,
      category: cat ? { ...cat, isCustom: false } : undefined,
    };
    setTransactions([newTx, ...transactions]);
    setShowForm(false);
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus size={16} />
          <span>Add Transaction</span>
        </button>
      </div>

      {showForm && (
        <div className="card form-card">
          <div className="form-card-header">
            <h2>New Transaction</h2>
            <button className="btn-icon" onClick={() => setShowForm(false)}>
              <FiX size={20} />
            </button>
          </div>
          <Formik
            initialValues={{
              description: '',
              amount: '',
              type: 'expense',
              date: new Date().toISOString().split('T')[0],
              categoryId: '',
              notes: '',
            }}
            validationSchema={transactionSchema}
            onSubmit={handleAdd}
          >
            <Form className="inline-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <Field type="text" name="description" id="description" className="form-control" />
                  <ErrorMessage name="description" component="div" className="form-error" />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount</label>
                  <Field type="number" name="amount" id="amount" className="form-control" step="0.01" />
                  <ErrorMessage name="amount" component="div" className="form-error" />
                </div>
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <Field as="select" name="type" id="type" className="form-control">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </Field>
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <Field type="date" name="date" id="date" className="form-control" />
                  <ErrorMessage name="date" component="div" className="form-error" />
                </div>
                <div className="form-group">
                  <label htmlFor="categoryId">Category</label>
                  <Field as="select" name="categoryId" id="categoryId" className="form-control">
                    <option value="">Select...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="categoryId" component="div" className="form-error" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
                <Field as="textarea" name="notes" id="notes" className="form-control" rows={2} />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Transaction
              </button>
            </Form>
          </Formik>
        </div>
      )}

      <div className="card filter-bar">
        <FiFilter size={16} />
        <select className="form-control filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="form-control filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="date"
          className="form-control filter-date"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          placeholder="From"
        />
        <input
          type="date"
          className="form-control filter-date"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          placeholder="To"
        />
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{tx.description}</td>
                <td>{tx.category?.name || '-'}</td>
                <td className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td>
                  <span className={`badge ${tx.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
                    {tx.type}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
