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

export interface Expense {
  id?: number;
  title: string;
  amount: number;
  date: string; // ISO yyyy-MM-dd
  notes?: string;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
}

export interface ExpenseSummary {
  totalAllTime: number;
  totalThisMonth: number;
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
