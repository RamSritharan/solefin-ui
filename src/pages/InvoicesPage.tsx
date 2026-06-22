import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi';
import { Invoice, InvoiceItem } from '../types';

const invoiceSchema = Yup.object().shape({
  clientName: Yup.string().required('Client name is required'),
  clientEmail: Yup.string().email('Invalid email').required('Client email is required'),
  dueDate: Yup.string().required('Due date is required'),
  items: Yup.array()
    .of(
      Yup.object().shape({
        description: Yup.string().required('Required'),
        quantity: Yup.number().positive().required('Required'),
        rate: Yup.number().positive().required('Required'),
      })
    )
    .min(1, 'At least one item is required'),
});

const initialInvoices: Invoice[] = [
  {
    id: '1', userId: 'u1', clientName: 'Acme Corp', clientEmail: 'billing@acme.com',
    amount: 5000, status: 'paid', dueDate: '2026-03-15',
    items: [{ description: 'Web Development', quantity: 1, rate: 5000, amount: 5000 }],
    createdAt: '2026-03-01',
  },
  {
    id: '2', userId: 'u1', clientName: 'TechStart Inc', clientEmail: 'ap@techstart.io',
    amount: 3200, status: 'sent', dueDate: '2026-04-20',
    items: [{ description: 'UI/UX Design', quantity: 40, rate: 80, amount: 3200 }],
    createdAt: '2026-04-01',
  },
  {
    id: '3', userId: 'u1', clientName: 'Green Gardens LLC', clientEmail: 'info@greengardens.com',
    amount: 1500, status: 'overdue', dueDate: '2026-03-30',
    items: [{ description: 'Logo Design', quantity: 1, rate: 1500, amount: 1500 }],
    createdAt: '2026-03-10',
  },
  {
    id: '4', userId: 'u1', clientName: 'CloudNine SaaS', clientEmail: 'finance@cloudnine.dev',
    amount: 8500, status: 'draft', dueDate: '2026-04-30',
    items: [
      { description: 'Backend Development', quantity: 50, rate: 120, amount: 6000 },
      { description: 'API Documentation', quantity: 25, rate: 100, amount: 2500 },
    ],
    createdAt: '2026-04-10',
  },
];

const statusColors: Record<string, string> = {
  draft: 'badge-gray',
  sent: 'badge-blue',
  viewed: 'badge-info',
  paid: 'badge-success',
  overdue: 'badge-danger',
};

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [showForm, setShowForm] = useState(false);

  const handleCreate = (values: any) => {
    const items: InvoiceItem[] = values.items.map((item: any) => ({
      ...item,
      quantity: Number(item.quantity),
      rate: Number(item.rate),
      amount: Number(item.quantity) * Number(item.rate),
    }));
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      userId: 'u1',
      clientName: values.clientName,
      clientEmail: values.clientEmail,
      amount: total,
      status: 'draft',
      dueDate: values.dueDate,
      items,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvoices([newInvoice, ...invoices]);
    setShowForm(false);
  };

  return (
    <div className="invoices-page">
      <div className="page-header">
        <h1 className="page-title">Invoices</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FiPlus size={16} />
          <span>Create Invoice</span>
        </button>
      </div>

      {showForm && (
        <div className="card form-card">
          <div className="form-card-header">
            <h2>New Invoice</h2>
            <button className="btn-icon" onClick={() => setShowForm(false)}>
              <FiX size={20} />
            </button>
          </div>
          <Formik
            initialValues={{
              clientName: '',
              clientEmail: '',
              dueDate: '',
              items: [{ description: '', quantity: 1, rate: 0 }],
            }}
            validationSchema={invoiceSchema}
            onSubmit={handleCreate}
          >
            {({ values }) => (
              <Form className="invoice-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="clientName">Client Name</label>
                    <Field type="text" name="clientName" id="clientName" className="form-control" />
                    <ErrorMessage name="clientName" component="div" className="form-error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="clientEmail">Client Email</label>
                    <Field type="email" name="clientEmail" id="clientEmail" className="form-control" />
                    <ErrorMessage name="clientEmail" component="div" className="form-error" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <Field type="date" name="dueDate" id="dueDate" className="form-control" />
                    <ErrorMessage name="dueDate" component="div" className="form-error" />
                  </div>
                </div>

                <h3 style={{ marginTop: '1rem' }}>Line Items</h3>
                <FieldArray name="items">
                  {({ push, remove }) => (
                    <div>
                      {values.items.map((_: any, index: number) => (
                        <div key={index} className="form-row items-row">
                          <div className="form-group" style={{ flex: 3 }}>
                            <label>Description</label>
                            <Field type="text" name={`items.${index}.description`} className="form-control" />
                            <ErrorMessage name={`items.${index}.description`} component="div" className="form-error" />
                          </div>
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>Qty</label>
                            <Field type="number" name={`items.${index}.quantity`} className="form-control" min="1" />
                          </div>
                          <div className="form-group" style={{ flex: 1 }}>
                            <label>Rate ($)</label>
                            <Field type="number" name={`items.${index}.rate`} className="form-control" step="0.01" />
                          </div>
                          <div className="form-group" style={{ flex: 1, alignSelf: 'flex-end' }}>
                            <span className="line-total">
                              ${((Number(values.items[index]?.quantity) || 0) * (Number(values.items[index]?.rate) || 0)).toFixed(2)}
                            </span>
                          </div>
                          {values.items.length > 1 && (
                            <button type="button" className="btn-icon btn-icon-danger" onClick={() => remove(index)} style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}>
                              <FiTrash2 size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => push({ description: '', quantity: 1, rate: 0 })}
                      >
                        <FiPlus size={14} /> Add Line Item
                      </button>
                    </div>
                  )}
                </FieldArray>

                <div style={{ marginTop: '1rem', textAlign: 'right', fontWeight: 600, fontSize: '1.1rem' }}>
                  Total: ${values.items.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0).toFixed(2)}
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Create Invoice
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.clientName}</td>
                <td>{inv.clientEmail}</td>
                <td>${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>
                  <span className={`badge ${statusColors[inv.status]}`}>{inv.status}</span>
                </td>
                <td>{inv.dueDate}</td>
                <td>{inv.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicesPage;
