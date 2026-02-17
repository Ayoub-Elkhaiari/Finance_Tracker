export type TransactionType = 'income' | 'expense';

export interface UserProfile {
  id: number;
  full_name: string;
  email: string;
  agreed_terms: boolean;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
}

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  date: string;
  description?: string;
  category_id: number;
}

export interface Budget {
  id: number;
  category_id: number;
  amount: number;
  month: string;
}

export interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
}
