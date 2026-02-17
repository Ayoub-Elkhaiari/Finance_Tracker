import { FormEvent, useEffect, useState } from 'react';

import { goalService } from '../api/services';
import type { Goal } from '../types';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState('');

  const loadData = async () => {
    const { data } = await goalService.list();
    setGoals(data);
  };

  useEffect(() => {
    loadData().catch(() => setGoals([]));
  }, []);

  const createGoal = async (e: FormEvent) => {
    e.preventDefault();
    await goalService.create({
      name,
      target_amount: Number(targetAmount),
      current_amount: Number(currentAmount),
      deadline: deadline || undefined
    });
    setName('');
    setTargetAmount('');
    setCurrentAmount('0');
    setDeadline('');
    await loadData();
  };

  const removeGoal = async (id: number) => {
    await goalService.remove(id);
    await loadData();
  };

  return (
    <section>
      <h1>Goals</h1>
      <div className="grid-two">
        <div className="card neo">
          <h3>Create Goal</h3>
          <form onSubmit={createGoal}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Goal name" required />
            <input
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Target amount"
              required
            />
            <input
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="Current amount"
              required
            />
            <input value={deadline} onChange={(e) => setDeadline(e.target.value)} type="date" />
            <button type="submit">Save Goal</button>
          </form>
        </div>

        <div className="card neo list">
          <h3>Goal Progress</h3>
          {goals.map((goal) => {
            const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
            return (
              <div key={goal.id} className="goal-item">
                <div className="row-item">
                  <strong>{goal.name}</strong>
                  <button className="danger" onClick={() => removeGoal(goal.id)}>Delete</button>
                </div>
                <p>
                  ${Number(goal.current_amount).toFixed(2)} / ${Number(goal.target_amount).toFixed(2)}
                </p>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
