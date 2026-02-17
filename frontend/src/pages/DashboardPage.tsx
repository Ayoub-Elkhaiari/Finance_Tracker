import { useEffect, useMemo, useState } from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

import { transactionService } from '../api/services';
import type { Transaction } from '../types';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    transactionService.list().then(({ data }) => setTransactions(data)).catch(() => setTransactions([]));
  }, []);

  const summary = useMemo(() => {
    const income = transactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const monthlyEvolution = useMemo(() => {
    const bucket = new Map<string, { month: string; income: number; expense: number; balance: number }>();
    transactions.forEach((tx) => {
      const month = tx.date.slice(0, 7);
      if (!bucket.has(month)) {
        bucket.set(month, { month, income: 0, expense: 0, balance: 0 });
      }
      const item = bucket.get(month)!;
      if (tx.type === 'income') item.income += Number(tx.amount);
      if (tx.type === 'expense') item.expense += Number(tx.amount);
      item.balance = item.income - item.expense;
    });

    return Array.from(bucket.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  const pieData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [summary.income, summary.expense],
        backgroundColor: ['#14b8a6', '#f97316']
      }
    ]
  };

  const barData = {
    labels: monthlyEvolution.map((item) => item.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyEvolution.map((item) => item.income),
        backgroundColor: '#3b82f6'
      },
      {
        label: 'Expense',
        data: monthlyEvolution.map((item) => item.expense),
        backgroundColor: '#ef4444'
      }
    ]
  };

  const lineData = {
    labels: monthlyEvolution.map((item) => item.month),
    datasets: [
      {
        label: 'Balance',
        data: monthlyEvolution.map((item) => item.balance),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.2)',
        tension: 0.35,
        fill: true
      }
    ]
  };

  return (
    <section>
      <h1>Financial Dashboard</h1>
      <div className="stats-grid">
        <div className="card neo"><h3>Total Income</h3><p>${summary.income.toFixed(2)}</p></div>
        <div className="card neo"><h3>Total Expense</h3><p>${summary.expense.toFixed(2)}</p></div>
        <div className="card neo"><h3>Net Balance</h3><p>${summary.balance.toFixed(2)}</p></div>
      </div>

      <div className="grid-two">
        <div className="card neo chart-panel">
          <h3>Income vs Expense</h3>
          <Pie data={pieData} />
        </div>
        <div className="card neo chart-panel">
          <h3>Monthly Evolution</h3>
          <Bar data={barData} />
        </div>
      </div>

      <div className="card neo chart-panel">
        <h3>Balance Trend</h3>
        <Line data={lineData} />
      </div>
    </section>
  );
}
