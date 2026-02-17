import { FormEvent, useEffect, useMemo, useState } from 'react';

import { budgetService, categoryService } from '../api/services';
import type { Budget, Category } from '../types';

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === 'expense'),
    [categories]
  );

  const loadData = async () => {
    const [budgetRes, categoryRes] = await Promise.all([budgetService.list(), categoryService.list()]);
    setBudgets(budgetRes.data);
    setCategories(categoryRes.data);
    if (categoryRes.data.length > 0) {
      const firstExpense = categoryRes.data.find((category) => category.type === 'expense');
      if (firstExpense) {
        setCategoryId(String(firstExpense.id));
      }
    }
  };

  useEffect(() => {
    loadData().catch(() => setBudgets([]));
  }, []);

  const createBudget = async (e: FormEvent) => {
    e.preventDefault();
    await budgetService.create({ category_id: Number(categoryId), amount: Number(amount), month });
    setAmount('');
    await loadData();
  };

  const removeBudget = async (id: number) => {
    await budgetService.remove(id);
    await loadData();
  };

  return (
    <section>
      <h1>Budgets</h1>
      <div className="grid-two">
        <div className="card neo">
          <h3>Set Monthly Budget</h3>
          <form onSubmit={createBudget}>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              {expenseCategories.map((category) => (
                <option value={category.id} key={category.id}>{category.name}</option>
              ))}
            </select>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Budget amount"
              required
            />
            <input value={month} onChange={(e) => setMonth(e.target.value)} type="month" required />
            <button type="submit">Add Budget</button>
          </form>
        </div>
        <div className="card neo list">
          <h3>Current Budgets</h3>
          {budgets.map((budget) => (
            <div key={budget.id} className="row-item">
              <span>Category #{budget.category_id} • ${Number(budget.amount).toFixed(2)} • {budget.month}</span>
              <button className="danger" onClick={() => removeBudget(budget.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
