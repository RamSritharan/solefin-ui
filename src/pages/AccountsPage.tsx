import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { Account } from "../types";
import { connectBank } from "../api/plaid";

const accountSchema = Yup.object().shape({
  name: Yup.string().required("Account name is required"),
  type: Yup.string()
    .oneOf(["checking", "savings", "credit_card", "cash"])
    .required("Type is required"),
  balance: Yup.number().required("Balance is required"),
  currency: Yup.string().required("Currency is required"),
});

const initialAccounts: Account[] = [
  {
    id: "1",
    userId: "u1",
    name: "Business Checking",
    type: "checking",
    balance: 15420.5,
    currency: "USD",
  },
  {
    id: "2",
    userId: "u1",
    name: "Business Savings",
    type: "savings",
    balance: 32000.0,
    currency: "USD",
  },
  {
    id: "3",
    userId: "u1",
    name: "Business Credit Card",
    type: "credit_card",
    balance: -2340.75,
    currency: "USD",
  },
  {
    id: "4",
    userId: "u1",
    name: "Petty Cash",
    type: "cash",
    balance: 500.0,
    currency: "USD",
  },
];

const typeLabels: Record<string, string> = {
  checking: "Checking",
  savings: "Savings",
  credit_card: "Credit Card",
  cash: "Cash",
};

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      setAccounts(accounts.filter((a) => a.id !== id));
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleSubmit = (values: Omit<Account, "id" | "userId">) => {
    if (editingAccount) {
      setAccounts(
        accounts.map((a) =>
          a.id === editingAccount.id ? { ...a, ...values } : a,
        ),
      );
    } else {
      const newAccount: Account = {
        ...values,
        id: Date.now().toString(),
        userId: "u1",
      };
      setAccounts([...accounts, newAccount]);
    }
    setShowForm(false);
    setEditingAccount(null);
  };

  return (
    <div className="accounts-page">
      <div className="page-header">
        <h1 className="page-title">Accounts</h1>
        <div className="page-header-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingAccount(null);
              setShowForm(!showForm);
            }}
          >
            <FiPlus size={16} />
            <span>Add Account</span>
          </button>
          <button className="btn btn-primary" onClick={() => connectBank()}>
            <FiPlus size={16} />
            <span>Connect to a Bank</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card form-card">
          <div className="form-card-header">
            <h2>{editingAccount ? "Edit Account" : "New Account"}</h2>
            <button
              className="btn-icon"
              onClick={() => {
                setShowForm(false);
                setEditingAccount(null);
              }}
            >
              <FiX size={20} />
            </button>
          </div>
          <Formik
            initialValues={{
              name: editingAccount?.name || "",
              type: editingAccount?.type || "checking",
              balance: editingAccount?.balance || 0,
              currency: editingAccount?.currency || "USD",
            }}
            validationSchema={accountSchema}
            onSubmit={(values) => {
              handleSubmit(values as Omit<Account, "id" | "userId">);
            }}
            enableReinitialize
          >
            <Form className="inline-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Account Name</label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="form-error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <Field
                    as="select"
                    name="type"
                    id="type"
                    className="form-control"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="cash">Cash</option>
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="form-error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="balance">Balance</label>
                  <Field
                    type="number"
                    name="balance"
                    id="balance"
                    className="form-control"
                    step="0.01"
                  />
                  <ErrorMessage
                    name="balance"
                    component="div"
                    className="form-error"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <Field
                    type="text"
                    name="currency"
                    id="currency"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="currency"
                    component="div"
                    className="form-error"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                {editingAccount ? "Update" : "Create"} Account
              </button>
            </Form>
          </Formik>
        </div>
      )}

      <div className="accounts-grid">
        {accounts.map((account) => (
          <div key={account.id} className="card account-card">
            <div className="account-card-header">
              <span className={`account-type-badge badge-${account.type}`}>
                {typeLabels[account.type]}
              </span>
              <div className="account-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEdit(account)}
                  aria-label="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  className="btn-icon btn-icon-danger"
                  onClick={() => handleDelete(account.id)}
                  aria-label="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="account-name">{account.name}</h3>
            <span
              className={`account-balance ${account.balance < 0 ? "amount-expense" : "amount-income"}`}
            >
              $
              {Math.abs(account.balance).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
              {account.balance < 0 && " (owed)"}
            </span>
            <span className="account-currency">{account.currency}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountsPage;
