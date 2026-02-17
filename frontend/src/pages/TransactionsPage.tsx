import { FormEvent, useEffect, useMemo, useState } from 'react';

import { categoryService, transactionService } from '../api/services';
import type { Category, Transaction, TransactionType } from '../types';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    const [txRes, catRes] = await Promise.all([transactionService.list(), categoryService.list()]);
    setTransactions(txRes.data);
    setCategories(catRes.data);
    if (!categoryId && catRes.data.length > 0) {
      setCategoryId(String(catRes.data[0].id));
    }
  };

  useEffect(() => {
    loadData().catch(() => setTransactions([]));
  }, []);

  const availableCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type]
  );

  useEffect(() => {
    if (availableCategories.length > 0) {
      setCategoryId(String(availableCategories[0].id));
    }
  }, [type]);

  const createTransaction = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await transactionService.create({
        amount: Number(amount),
        type,
        date,
        description,
        category_id: Number(categoryId)
      });
      setAmount('');
      setDescription('');
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to create transaction.');
    }
  };

  const removeTransaction = async (id: number) => {
    try {
      await transactionService.remove(id);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to delete transaction.');
    }
  };

  return (
    <section>
      <h1>Transactions</h1>
      <div className="grid-two">
        <div className="card neo">
          <h3>Add Transaction</h3>
          <form onSubmit={createTransaction}>
            <div className="split">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Amount"
                required
              />
              <select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input value={date} onChange={(e) => setDate(e.target.value)} type="date" required />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            {error && <p className="error">{error}</p>}
            <button type="submit">Save Transaction</button>
          </form>
        </div>

        <div className="card neo">
          <h3>Transaction History</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.type}</td>
                  <td>${Number(transaction.amount).toFixed(2)}</td>
                  <td>{transaction.description ?? '-'}</td>
                  <td>
                    <button className="danger" onClick={() => removeTransaction(transaction.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
