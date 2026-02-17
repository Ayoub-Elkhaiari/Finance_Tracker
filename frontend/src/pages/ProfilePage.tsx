import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <section>
      <h1>Profile</h1>
      <div className="card neo list">
        <p><strong>Full Name:</strong> {user?.full_name ?? '-'}</p>
        <p><strong>Email:</strong> {user?.email ?? '-'}</p>
        <p><strong>User ID:</strong> {user?.id ?? '-'}</p>
        <p><strong>Terms agreed:</strong> {user?.agreed_terms ? 'Yes' : 'No'}</p>
      </div>
    </section>
  );
}
