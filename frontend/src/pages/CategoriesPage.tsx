import { FormEvent, useEffect, useState } from 'react';

import { categoryService } from '../api/services';
import type { Category, TransactionType } from '../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [error, setError] = useState('');

  const loadData = async () => {
    const { data } = await categoryService.list();
    setCategories(data);
  };

  useEffect(() => {
    loadData().catch(() => setCategories([]));
  }, []);

  const createCategory = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await categoryService.create({ name, type });
      setName('');
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to create category.');
    }
  };

  const removeCategory = async (id: number) => {
    try {
      await categoryService.remove(id);
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Failed to delete category.');
    }
  };

  return (
    <section>
      <h1>Categories</h1>
      <div className="grid-two">
        <div className="card neo">
          <h3>Create Category</h3>
          <form onSubmit={createCategory}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
            <select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            {error && <p className="error">{error}</p>}
            <button type="submit">Add Category</button>
          </form>
        </div>
        <div className="card neo list">
          <h3>All Categories</h3>
          {categories.map((category) => (
            <div key={category.id} className="row-item">
              <span>{category.name} ({category.type})</span>
              <button className="danger" onClick={() => removeCategory(category.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
