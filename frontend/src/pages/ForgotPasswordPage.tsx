import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordPage() {
  const { forgotPassword, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const requestReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
      if (response.resetToken) {
        setToken(response.resetToken);
      }
    } catch {
      setError('Unable to process request right now.');
    }
  };

  const submitReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const responseMessage = await resetPassword(token, newPassword);
      setMessage(responseMessage);
      setNewPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? 'Password reset failed.');
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card modern-auth-card">
        <h1>Reset your password</h1>
        <p className="muted">Step 1: request a reset token.</p>
        <form onSubmit={requestReset}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
          <button type="submit">Generate reset token</button>
        </form>

        <p className="muted">Step 2: use token to set a new password.</p>
        <form onSubmit={submitReset}>
          <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Reset token" required />
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            placeholder="New password"
            minLength={8}
            required
          />
          <button type="submit">Reset password</button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <p>
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
