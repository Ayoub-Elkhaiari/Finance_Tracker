import apiClient from './client';
import type { Budget, Category, Goal, Transaction, UserProfile } from '../types';

export const authService = {
  register: async (payload: {
    full_name: string;
    email: string;
    password: string;
    agreed_terms: boolean;
  }) => apiClient.post<UserProfile>('/auth/register', payload),
  login: async (email: string, password: string) =>
    apiClient.post<{ access_token: string; token_type: string }>('/auth/login', { email, password }),
  forgotPassword: async (email: string) =>
    apiClient.post<{ message: string; reset_token?: string }>('/auth/forgot-password', { email }),
  resetPassword: async (token: string, newPassword: string) =>
    apiClient.post<{ message: string }>('/auth/reset-password', {
      token,
      new_password: newPassword
    }),
  me: async () => apiClient.get<UserProfile>('/auth/me')
};

export const transactionService = {
  list: async () => apiClient.get<Transaction[]>('/transactions'),
  create: async (payload: Omit<Transaction, 'id'>) => apiClient.post<Transaction>('/transactions', payload),
  update: async (id: number, payload: Partial<Transaction>) =>
    apiClient.put<Transaction>(`/transactions/${id}`, payload),
  remove: async (id: number) => apiClient.delete(`/transactions/${id}`)
};

export const categoryService = {
  list: async () => apiClient.get<Category[]>('/categories'),
  create: async (payload: Omit<Category, 'id'>) => apiClient.post<Category>('/categories', payload),
  remove: async (id: number) => apiClient.delete(`/categories/${id}`)
};

export const budgetService = {
  list: async () => apiClient.get<Budget[]>('/budgets'),
  create: async (payload: Omit<Budget, 'id'>) => apiClient.post<Budget>('/budgets', payload),
  remove: async (id: number) => apiClient.delete(`/budgets/${id}`)
};

export const goalService = {
  list: async () => apiClient.get<Goal[]>('/goals'),
  create: async (payload: Omit<Goal, 'id'>) => apiClient.post<Goal>('/goals', payload),
  remove: async (id: number) => apiClient.delete(`/goals/${id}`)
};
