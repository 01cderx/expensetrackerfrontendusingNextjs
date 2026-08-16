export interface User {
  userId: number;
  name: string;
  email: string;
}

export interface Category {
  id?: number;
  name: string;
  color: string;
}

export type TransactionType = "INCOME" | "EXPENSE";

export interface Expense {
  id?: number;
  title: string;
  amount: number;
  date: string; // ISO yyyy-MM-dd
  notes?: string;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
  type: TransactionType;
}

export interface ExpenseSummary {
  totalIncomeAllTime: number;
  totalExpenseAllTime: number;
  balanceAllTime: number;
  totalIncomeThisMonth: number;
  totalExpenseThisMonth: number;
  balanceThisMonth: number;
  byCategory: Record<string, number>;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface TrendPoint {
  label: string;
  income: number;
  expense: number;
}

export interface Report {
  periodLabel: string;
  totalIncome: number;
  totalExpense: number;
  net: number;
  byCategory: Record<string, number>;
  trend: TrendPoint[];
}
