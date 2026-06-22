export interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
  role: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'checking' | 'savings' | 'credit_card' | 'cash';
  balance: number;
  currency: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  scheduleCLine?: string;
  isCustom: boolean;
  userId?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  description: string;
  notes?: string;
  receiptUrl?: string;
  category?: Category;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';
  dueDate: string;
  items: InvoiceItem[];
  createdAt: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  cashFlow: number;
  recentTransactions: Transaction[];
  upcomingBills: Transaction[];
}
