import { useAuthStore } from '../store/authStore';

export default function Account() {
  const { user, logout } = useAuthStore();
  if (!user) return null;

  return (
    <section className="sec">
      <div className="w">
        <div className="sh"><h3>My account</h3></div>
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <button className="btn" style={{ color: '#222', marginTop: 16 }} onClick={logout}>Log out</button>
      </div>
    </section>
  );
}